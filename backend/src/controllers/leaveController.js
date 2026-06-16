const Leave = require('../models/Leave');
const User = require('../models/User');
const { sendNotification } = require('../utils/notificationHelper');

// @desc    Create a leave request
// @route   POST /api/leaves
// @access  Private (Employee only)
const createLeaveRequest = async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;

  try {
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'Start date cannot be after end date' });
    }

    const today = new Date();
    const serverTodayStr = today.toISOString().split('T')[0];
    const thresholdDate = new Date(serverTodayStr);
    thresholdDate.setDate(thresholdDate.getDate() - 1);

    const inputDate = new Date(startDate);

    if (inputDate < thresholdDate) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    const leave = await Leave.create({
      employee: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason,
      company: req.companyId,
    });

    const populatedLeave = await Leave.findOne({ _id: leave._id, company: req.companyId }).populate('employee', 'name email position');

    // Notify all HR Managers and Admins in the same company
    const managers = await User.find({ role: { $in: ['Admin', 'HR'] }, company: req.companyId });
    for (const mgr of managers) {
      await sendNotification(
        mgr._id,
        'LeaveRequest',
        `New leave request (${leaveType}) submitted by ${req.user.name}`,
        req.companyId
      );
    }

    res.status(201).json(populatedLeave);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get logged in employee's leave requests
// @route   GET /api/leaves/my-leaves
// @access  Private
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id, company: req.companyId }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all leave requests
// @route   GET /api/leaves
// @access  Private (Admin, HR)
const getAllLeaves = async (req, res) => {
  try {
    let query = { company: req.companyId };

    if (req.user.role === 'Manager') {
      if (!req.user.department) {
        query.employee = { $in: [] };
      } else {
        const employeesInDept = await User.find({ department: req.user.department, company: req.companyId }).select('_id');
        const employeeIds = employeesInDept.map(emp => emp._id);
        query.employee = { $in: employeeIds };
      }
    }

    const leaves = await Leave.find(query)
      .populate('employee', 'name email position role status department')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Approve/Reject leave request
// @route   PUT /api/leaves/:id/status
// @access  Private (Admin, HR)
const updateLeaveStatus = async (req, res) => {
  const { status, rejectionReason } = req.body; // status: 'Approved' or 'Rejected'

  try {
    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required (Approved or Rejected)' });
    }

    const leave = await Leave.findOne({ _id: req.params.id, company: req.companyId });

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.employee.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: 'You cannot approve or reject your own leave request' });
    }

    const employee = await User.findById(leave.employee);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employee.role === 'HR') {
      const isApproverAdmin = req.user.role === 'Admin';
      const isApproverHRManager = req.user.role === 'Manager' && 
                                  req.user.department && 
                                  employee.department && 
                                  req.user.department.toString() === employee.department.toString();
      
      if (!isApproverAdmin && !isApproverHRManager) {
        return res.status(403).json({ message: 'Only Admin and the Manager of the HR department can approve or reject this leave request' });
      }
    }

    if (req.user.role === 'Manager') {
      if (!employee.department || employee.department.toString() !== req.user.department?.toString()) {
        return res.status(403).json({ message: 'You are not authorized to approve or reject leave requests outside your department' });
      }
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Leave request has already been processed' });
    }

    leave.status = status;
    leave.approvedBy = req.user._id;

    if (status === 'Rejected' && rejectionReason) {
      leave.rejectionReason = rejectionReason;
    }

    await leave.save();

    // Notify the employee about the decision
    await sendNotification(
      leave.employee,
      'LeaveRequest',
      `Your leave request (${leave.leaveType}) has been ${status}`,
      req.companyId
    );

    const updatedLeave = await Leave.findOne({ _id: leave._id, company: req.companyId })
      .populate('employee', 'name email position')
      .populate('approvedBy', 'name email');

    res.json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createLeaveRequest,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
};
