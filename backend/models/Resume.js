const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    trim: true
  },
  summary: {
    type: String,
    trim: true
  },
  education: {
    type: String,
    required: [true, 'Education is required'],
    trim: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  fileName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
resumeSchema.index({ uploadDate: -1 });
resumeSchema.index({ email: 1 });

module.exports = mongoose.model('Resume', resumeSchema);