const Department = require('../models/Department');
const User = require('../models/User');

// @desc    Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ company: req.companyId }).populate('manager', 'name email position profileImage');
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create department
// @route   POST /api/departments
// @access  Private (Admin, HR)
const createDepartment = async (req, res) => {
  const { name, description, manager } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: 'Department name is required' });
    }

    const deptExists = await Department.findOne({ name: name.trim(), company: req.companyId });
    if (deptExists) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    const departmentPayload = {
      name: name.trim(),
      description,
      company: req.companyId,
    };

    if (manager && manager !== 'null' && manager !== '') {
      departmentPayload.manager = manager;
    }

    const department = await Department.create(departmentPayload);

    // If manager is assigned, update user role to 'Manager'
    if (manager && manager !== 'null' && manager !== '') {
      await User.findOneAndUpdate({ _id: manager, company: req.companyId }, { role: 'Manager' });
    }

    const populatedDept = await Department.findOne({ _id: department._id, company: req.companyId }).populate('manager', 'name email position profileImage');
    res.status(201).json(populatedDept);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin, HR)
const updateDepartment = async (req, res) => {
  const { name, description, manager } = req.body;

  try {
    const dept = await Department.findOne({ _id: req.params.id, company: req.companyId });
    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }

    if (name) dept.name = name.trim();
    if (description !== undefined) dept.description = description;
    
    if (manager !== undefined) {
      // If there was an old manager, demote them to 'Employee' unless they are Admin or HR
      if (dept.manager && dept.manager.toString() !== manager) {
        const oldManager = await User.findOne({ _id: dept.manager, company: req.companyId });
        if (oldManager && oldManager.role === 'Manager') {
          oldManager.role = 'Employee';
          await oldManager.save();
        }
      }

      dept.manager = (manager === 'null' || manager === '') ? null : manager;

      // Update new manager's role to 'Manager'
      if (manager && manager !== 'null' && manager !== '') {
        const newManager = await User.findOne({ _id: manager, company: req.companyId });
        if (newManager && newManager.role === 'Employee') {
          newManager.role = 'Manager';
          await newManager.save();
        }
      }
    }

    await dept.save();
    const populatedDept = await Department.findOne({ _id: dept._id, company: req.companyId }).populate('manager', 'name email position profileImage');
    res.json(populatedDept);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin only)
const deleteDepartment = async (req, res) => {
  try {
    const dept = await Department.findOne({ _id: req.params.id, company: req.companyId });
    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Demote manager if deleting department
    if (dept.manager) {
      const managerUser = await User.findOne({ _id: dept.manager, company: req.companyId });
      if (managerUser && managerUser.role === 'Manager') {
        managerUser.role = 'Employee';
        await managerUser.save();
      }
    }

    // Unassign department from users
    await User.updateMany({ department: req.params.id, company: req.companyId }, { department: null });

    await Department.findOneAndDelete({ _id: req.params.id, company: req.companyId });
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
