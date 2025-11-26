const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: [true, 'Please specify a classroom'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookingDate: {
    type: Date,
    required: [true, 'Please provide a booking date'],
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
  purpose: {
    type: String,
    required: [true, 'Please provide the purpose of booking'],
    maxlength: [500, 'Purpose cannot exceed 500 characters'],
  },
  numberOfPeople: {
    type: Number,
    required: [true, 'Please specify number of people'],
    min: [1, 'Number of people must be at least 1'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
  },
}, {
  timestamps: true,
});

// Indexes for performance
bookingSchema.index({ classroom: 1, bookingDate: 1, status: 1 });
bookingSchema.index({ user: 1, status: 1, bookingDate: -1 });
bookingSchema.index({ status: 1, createdAt: -1 });

// Validate endTime is after startTime
bookingSchema.pre('validate', function(next) {
  const [startHour, startMin] = this.startTime.split(':').map(Number);
  const [endHour, endMin] = this.endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  if (endMinutes <= startMinutes) {
    this.invalidate('endTime', 'End time must be after start time');
  }

  // Check duration (30 min - 4 hours)
  const durationMinutes = endMinutes - startMinutes;
  if (durationMinutes < 30) {
    this.invalidate('endTime', 'Booking duration must be at least 30 minutes');
  }
  if (durationMinutes > 240) {
    this.invalidate('endTime', 'Booking duration cannot exceed 4 hours');
  }

  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
