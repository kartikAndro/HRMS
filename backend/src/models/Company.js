const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  subdomain: {
    type: String,
    required: [true, 'Subdomain is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  plan: {
    type: String,
    enum: ['Free', 'Professional', 'Enterprise'],
    default: 'Free',
  },
  active: {
    type: Boolean,
    default: true,
  }
}, {

  timestamps: true,
  
});

module.exports = mongoose.model('Company', companySchema);
