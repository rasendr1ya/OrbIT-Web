const Booking = require('../models/Booking');
const Classroom = require('../models/Classroom');
const { checkConflict, getAvailableSlots } = require('../utils/conflictChecker');
const { sendBookingEmail } = require('../utils/emailService');

// @desc    Get all bookings (with filters)
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
  try {
    const { status, classroom, date, user, page = 1, limit = 10 } = req.query;

    const query = {};

    // Mahasiswa can only see their own bookings
    if (req.user.primaryRole === 'mahasiswa') {
      query.user = req.user.id;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by classroom
    if (classroom) {
      query.classroom = classroom;
    }

    // Filter by date
    if (date) {
      const queryDate = new Date(date);
      query.bookingDate = {
        $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
        $lt: new Date(queryDate.setHours(23, 59, 59, 999)),
      };
    }

    // Filter by user (Admin/Tendik only)
    if (user && ['admin', 'tendik'].includes(req.user.primaryRole)) {
      query.user = user;
    }

    // Pagination
    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .populate('classroom', 'name building capacity')
      .populate('user', 'fullName email nrp')
      .populate('approvedBy', 'fullName')
      .sort({ bookingDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('classroom', 'name building capacity facilities')
      .populate('user', 'fullName email nrp phoneNumber')
      .populate('approvedBy', 'fullName email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization
    if (booking.user._id.toString() !== req.user.id &&
        !['admin', 'tendik', 'dosen'].includes(req.user.primaryRole)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { classroom, bookingDate, startTime, endTime, purpose, numberOfPeople } = req.body;

    // Validate classroom exists
    const classroomDoc = await Classroom.findById(classroom);
    if (!classroomDoc) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found',
      });
    }

    // Check capacity
    if (numberOfPeople > classroomDoc.capacity) {
      return res.status(400).json({
        success: false,
        message: `Number of people (${numberOfPeople}) exceeds classroom capacity (${classroomDoc.capacity})`,
      });
    }

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookDate = new Date(bookingDate);
    bookDate.setHours(0, 0, 0, 0);

    if (bookDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book a date in the past',
      });
    }

    // Check for conflicts
    const conflict = await checkConflict({
      classroom,
      bookingDate,
      startTime,
      endTime,
    });

    if (conflict.exists) {
      return res.status(409).json({
        success: false,
        message: 'Booking conflict detected',
        conflict: {
          type: conflict.type,
          details: conflict.details,
        },
      });
    }

    // Determine status based on user role
    let status = 'pending';
    let approvedBy = null;
    let approvedAt = null;

    if (['dosen', 'tendik', 'admin'].includes(req.user.primaryRole)) {
      status = 'approved';
      approvedBy = req.user.id;
      approvedAt = new Date();
    }

    // Create booking
    const booking = await Booking.create({
      classroom,
      user: req.user.id,
      bookingDate,
      startTime,
      endTime,
      purpose,
      numberOfPeople,
      status,
      approvedBy,
      approvedAt,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('classroom', 'name building')
      .populate('user', 'fullName email');

    const message = status === 'approved'
      ? 'Booking created and automatically approved'
      : 'Booking request submitted, waiting for approval';

    res.status(201).json({
      success: true,
      message,
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve booking
// @route   PUT /api/bookings/:id/approve
// @access  Private (Tendik, Admin)
exports.approveBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('classroom', 'name building')
      .populate('user', 'fullName email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot approve booking with status: ${booking.status}`,
      });
    }

    // Check for conflicts again (in case new bookings were made)
    const conflict = await checkConflict({
      classroom: booking.classroom._id,
      bookingDate: booking.bookingDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      excludeBookingId: booking._id,
    });

    if (conflict.exists) {
      return res.status(409).json({
        success: false,
        message: 'Booking conflict detected',
        conflict: {
          type: conflict.type,
          details: conflict.details,
        },
      });
    }

    // Approve booking
    booking.status = 'approved';
    booking.approvedBy = req.user.id;
    booking.approvedAt = new Date();
    if (req.body.notes) {
      booking.notes = req.body.notes;
    }

    await booking.save();

    // Populate approvedBy
    await booking.populate('approvedBy', 'fullName');

    // Send email notification
    await sendBookingEmail(booking, 'approved');

    res.status(200).json({
      success: true,
      message: 'Booking approved successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject booking
// @route   PUT /api/bookings/:id/reject
// @access  Private (Tendik, Admin)
exports.rejectBooking = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a rejection reason',
      });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('classroom', 'name building')
      .populate('user', 'fullName email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject booking with status: ${booking.status}`,
      });
    }

    booking.status = 'rejected';
    booking.rejectionReason = rejectionReason;
    await booking.save();

    // Send email notification
    await sendBookingEmail(booking, 'rejected');

    res.status(200).json({
      success: true,
      message: 'Booking rejected',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization
    if (booking.user.toString() !== req.user.id && req.user.primaryRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    // Can only cancel pending or approved bookings
    if (!['pending', 'approved'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel booking with status: ${booking.status}`,
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get calendar events (for calendar view)
// @route   GET /api/bookings/calendar
// @access  Private
exports.getCalendarEvents = async (req, res, next) => {
  try {
    const { startDate, endDate, classroom } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide startDate and endDate',
      });
    }

    const query = {
      bookingDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
      status: 'approved',
    };

    if (classroom) {
      query.classroom = classroom;
    }

    const bookings = await Booking.find(query)
      .populate('classroom', 'name')
      .populate('user', 'fullName');

    // Transform to calendar event format
    const events = bookings.map(booking => ({
      id: booking._id,
      title: `${booking.purpose.substring(0, 30)} - ${booking.user.fullName}`,
      start: `${booking.bookingDate.toISOString().split('T')[0]}T${booking.startTime}:00`,
      end: `${booking.bookingDate.toISOString().split('T')[0]}T${booking.endTime}:00`,
      type: 'booking',
      status: booking.status,
      color: '#10B981',
      extendedProps: {
        purpose: booking.purpose,
        numberOfPeople: booking.numberOfPeople,
        classroom: booking.classroom.name,
        user: booking.user.fullName,
      },
    }));

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    next(error);
  }
};
