const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide classroom name'],
    unique: true,
    trim: true,
  },
  building: {
    type: String,
    trim: true,
  },
  floor: {
    type: Number,
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide classroom capacity'],
    min: [1, 'Capacity must be at least 1'],
  },
  facilities: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
classroomSchema.index({ name: 1 });
classroomSchema.index({ isActive: 1 });

module.exports = mongoose.model('Classroom', classroomSchema);
