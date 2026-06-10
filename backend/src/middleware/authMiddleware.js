const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwthrkey12345');

      // Get user from the token, populating company, and attach to request object
      req.user = await User.findById(decoded.id).select('-password').populate('company');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      if (req.user.status === 'Inactive') {
        return res.status(403).json({ message: 'User account is deactivated' });
      }

      if (!req.user.company) {
        return res.status(403).json({ message: 'Not authorized, no company association found' });
      }

      if (!req.user.company.active) {
        return res.status(403).json({ message: 'Your company account is inactive/deactivated' });
      }

      req.companyId = req.user.company._id;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const resolveTenant = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwthrkey12345');
      const user = await User.findById(decoded.id).select('company');
      if (user) {
        req.companyId = user.company;
      }
    } catch (error) {
      // Ignore token verification errors for public routes
    }
  }

  // Fallback: Check if subdomain or company ID query param/headers are present
  if (!req.companyId) {
    const companyId = req.headers['x-company-id'] || req.query.companyId;
    if (companyId) {
      req.companyId = companyId;
    } else {
      const subdomain = req.headers['x-subdomain'] || req.query.subdomain;
      if (subdomain) {
        const company = await Company.findOne({ subdomain: subdomain.toLowerCase() });
        if (company) {
          req.companyId = company._id;
        }
      }
    }
  }
  next();
};

module.exports = { protect, resolveTenant };
