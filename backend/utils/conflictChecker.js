const RegularSchedule = require('../models/RegularSchedule');
const Booking = require('../models/Booking');

// Helper: Convert time string to minutes
const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper: Convert minutes to time string
const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

// Helper: Check if two time ranges overlap
const timeOverlap = (start1, end1, start2, end2) => {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);

  return (s1 < e2 && e1 > s2);
};

// Check booking conflicts
exports.checkConflict = async ({ classroom, bookingDate, startTime, endTime, excludeBookingId = null }) => {
  const date = new Date(bookingDate);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // 1. Check against regular schedules
  const regularSchedules = await RegularSchedule.find({
    classroom,
    dayOfWeek,
    isActive: true,
  });

  for (let schedule of regularSchedules) {
    if (timeOverlap(startTime, endTime, schedule.startTime, schedule.endTime)) {
      return {
        exists: true,
        type: 'regular_schedule',
        details: `Ruangan sudah digunakan untuk kuliah ${schedule.courseName} pada ${schedule.startTime}-${schedule.endTime}`,
        data: schedule,
      };
    }
  }

  // 2. Check against existing approved bookings
  const query = {
    classroom,
    bookingDate: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999)),
    },
    status: 'approved',
  };

  // Exclude current booking when updating
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const existingBookings = await Booking.find(query).populate('user', 'fullName');

  for (let booking of existingBookings) {
    if (timeOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
      return {
        exists: true,
        type: 'booking',
        details: `Ruangan sudah dibooking oleh ${booking.user.fullName} pada ${booking.startTime}-${booking.endTime}`,
        data: booking,
      };
    }
  }

  return { exists: false };
};

// Get available time slots for a classroom on a specific date
exports.getAvailableSlots = async (classroom, bookingDate) => {
  const date = new Date(bookingDate);
  const dayOfWeek = date.getDay();

  // Operating hours: 07:00 - 21:00
  const operatingStart = 7 * 60; // 420 minutes
  const operatingEnd = 21 * 60;  // 1260 minutes

  // Get all occupied time slots
  const occupiedSlots = [];

  // 1. Add regular schedules
  const schedules = await RegularSchedule.find({
    classroom,
    dayOfWeek,
    isActive: true,
  });

  schedules.forEach(schedule => {
    occupiedSlots.push({
      start: timeToMinutes(schedule.startTime),
      end: timeToMinutes(schedule.endTime),
      type: 'regular',
      label: schedule.courseName,
    });
  });

  // 2. Add approved bookings
  const bookings = await Booking.find({
    classroom,
    bookingDate: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999)),
    },
    status: 'approved',
  }).populate('user', 'fullName');

  bookings.forEach(booking => {
    occupiedSlots.push({
      start: timeToMinutes(booking.startTime),
      end: timeToMinutes(booking.endTime),
      type: 'booking',
      label: `Booked by ${booking.user.fullName}`,
    });
  });

  // Sort occupied slots by start time
  occupiedSlots.sort((a, b) => a.start - b.start);

  // Find available slots
  const availableSlots = [];
  let currentTime = operatingStart;

  for (let slot of occupiedSlots) {
    if (currentTime < slot.start) {
      availableSlots.push({
        start: minutesToTime(currentTime),
        end: minutesToTime(slot.start),
      });
    }
    currentTime = Math.max(currentTime, slot.end);
  }

  // Add remaining time until operating end
  if (currentTime < operatingEnd) {
    availableSlots.push({
      start: minutesToTime(currentTime),
      end: minutesToTime(operatingEnd),
    });
  }

  return { availableSlots, occupiedSlots };
};
