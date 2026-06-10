const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required'],
  }
}, {
  timestamps: true,
});

// Compound unique index so department names are only unique per company
departmentSchema.index({ name: 1, company: 1 }, { unique: true });

module.exports = mongoose.model('Department', departmentSchema);
