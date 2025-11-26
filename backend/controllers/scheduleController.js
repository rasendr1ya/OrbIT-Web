const RegularSchedule = require('../models/RegularSchedule');

// @desc    Get all regular schedules
// @route   GET /api/schedules
// @access  Private
exports.getSchedules = async (req, res, next) => {
  try {
    const { classroom, dayOfWeek, semester } = req.query;

    const query = { isActive: true };

    if (classroom) {
      query.classroom = classroom;
    }

    if (dayOfWeek) {
      query.dayOfWeek = parseInt(dayOfWeek);
    }

    if (semester) {
      query.semester = semester;
    }

    const schedules = await RegularSchedule.find(query)
      .populate('classroom', 'name building capacity')
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single schedule
// @route   GET /api/schedules/:id
// @access  Private
exports.getSchedule = async (req, res, next) => {
  try {
    const schedule = await RegularSchedule.findById(req.params.id)
      .populate('classroom', 'name building capacity');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new schedule
// @route   POST /api/schedules
// @access  Private (Admin)
exports.createSchedule = async (req, res, next) => {
  try {
    const { classroom, courseName, courseCode, lecturer, dayOfWeek, startTime, endTime, semester } = req.body;

    const schedule = await RegularSchedule.create({
      classroom,
      courseName,
      courseCode,
      lecturer,
      dayOfWeek,
      startTime,
      endTime,
      semester,
    });

    const populatedSchedule = await RegularSchedule.findById(schedule._id)
      .populate('classroom', 'name building');

    res.status(201).json({
      success: true,
      message: 'Regular schedule created successfully',
      data: populatedSchedule,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update schedule
// @route   PUT /api/schedules/:id
// @access  Private (Admin)
exports.updateSchedule = async (req, res, next) => {
  try {
    let schedule = await RegularSchedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    const { classroom, courseName, courseCode, lecturer, dayOfWeek, startTime, endTime, semester, isActive } = req.body;

    if (classroom) schedule.classroom = classroom;
    if (courseName) schedule.courseName = courseName;
    if (courseCode) schedule.courseCode = courseCode;
    if (lecturer) schedule.lecturer = lecturer;
    if (dayOfWeek !== undefined) schedule.dayOfWeek = dayOfWeek;
    if (startTime) schedule.startTime = startTime;
    if (endTime) schedule.endTime = endTime;
    if (semester) schedule.semester = semester;
    if (typeof isActive !== 'undefined') schedule.isActive = isActive;

    await schedule.save();

    schedule = await RegularSchedule.findById(schedule._id)
      .populate('classroom', 'name building');

    res.status(200).json({
      success: true,
      message: 'Schedule updated successfully',
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete schedule
// @route   DELETE /api/schedules/:id
// @access  Private (Admin)
exports.deleteSchedule = async (req, res, next) => {
  try {
    const schedule = await RegularSchedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    // Soft delete
    schedule.isActive = false;
    await schedule.save();

    res.status(200).json({
      success: true,
      message: 'Schedule deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
