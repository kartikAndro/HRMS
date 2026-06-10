const User = require('../models/User');
const Company = require('../models/Company');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email, select password, and populate department and company
    const user = await User.findOne({ email })
      .select('+password')
      .populate('department', 'name')
      .populate('company');

    if (user && (await user.matchPassword(password))) {
      if (user.status === 'Inactive') {
        return res.status(403).json({ message: 'Your account is deactivated' });
      }

      if (user.company && !user.company.active) {
        return res.status(403).json({ message: 'Your company account is inactive/deactivated' });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position,
        joiningDate: user.joiningDate,
        status: user.status,
        profileImage: user.profileImage,
        salary: user.salary,
        company: user.company,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user is attached by protect middleware
    const user = await User.findById(req.user._id)
      .populate('department', 'name')
      .populate('company');
      
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Register a new company and its first Admin user
// @route   POST /api/auth/register-company
// @access  Public
const registerCompany = async (req, res) => {
  const { companyName, subdomain, adminName, adminEmail, adminPassword } = req.body;

  try {
    if (!companyName || !subdomain || !adminName || !adminEmail || !adminPassword) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if subdomain already exists
    const companyExists = await Company.findOne({ subdomain: subdomain.toLowerCase() });
    if (companyExists) {
      return res.status(400).json({ message: 'Company with this subdomain already exists' });
    }

    // Check if user email already exists
    const userExists = await User.findOne({ email: adminEmail.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create Company
    const company = await Company.create({
      name: companyName,
      subdomain: subdomain.toLowerCase(),
      plan: 'Free'
    });

    // Create Admin User for this Company
    const user = await User.create({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      role: 'Admin',
      position: 'Company Owner',
      company: company._id,
      salary: 0
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      position: user.position,
      company: {
        _id: company._id,
        name: company.name,
        subdomain: company.subdomain,
        plan: company.plan
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  loginUser,
  getMe,
  registerCompany,
};
