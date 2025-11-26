const mongoose = require('mongoose');

const regularScheduleSchema = new mongoose.Schema({
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: [true, 'Please specify a classroom'],
  },
  courseName: {
    type: String,
    required: [true, 'Please provide course name'],
    trim: true,
  },
  courseCode: {
    type: String,
    trim: true,
  },
  lecturer: {
    type: String,
    required: [true, 'Please provide lecturer name'],
    trim: true,
  },
  dayOfWeek: {
    type: Number,
    required: [true, 'Please specify day of week'],
    min: [0, 'Day of week must be between 0-6'],
    max: [6, 'Day of week must be between 0-6'],
  },
  startTime: {
    type: String,
    required: [true, 'Please provide start time'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:mm format'],
  },
  endTime: {
    type: String,
    required: [true, 'Please provide end time'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:mm format'],
  },
  semester: {
    type: String,
    required: [true, 'Please specify semester'],
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
regularScheduleSchema.index({ classroom: 1, dayOfWeek: 1 });
regularScheduleSchema.index({ isActive: 1 });

module.exports = mongoose.model('RegularSchedule', regularScheduleSchema);
