const Classroom = require('../models/Classroom');
const { getAvailableSlots } = require('../utils/conflictChecker');

// @desc    Get all classrooms
// @route   GET /api/classrooms
// @access  Private
exports.getClassrooms = async (req, res, next) => {
  try {
    const classrooms = await Classroom.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: classrooms.length,
      data: classrooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single classroom
// @route   GET /api/classrooms/:id
// @access  Private
exports.getClassroom = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found',
      });
    }

    res.status(200).json({
      success: true,
      data: classroom,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get classroom availability for a specific date
// @route   GET /api/classrooms/:id/availability
// @access  Private
exports.getClassroomAvailability = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a date',
      });
    }

    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found',
      });
    }

    const { availableSlots, occupiedSlots } = await getAvailableSlots(req.params.id, date);

    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.getDay();

    res.status(200).json({
      success: true,
      classroom: {
        _id: classroom._id,
        name: classroom.name,
        capacity: classroom.capacity,
        facilities: classroom.facilities,
      },
      date,
      dayOfWeek,
      availableSlots,
      occupiedSlots,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new classroom
// @route   POST /api/classrooms
// @access  Private (Admin, Tendik)
exports.createClassroom = async (req, res, next) => {
  try {
    const { name, building, floor, capacity, facilities } = req.body;

    const classroom = await Classroom.create({
      name,
      building,
      floor,
      capacity,
      facilities,
    });

    res.status(201).json({
      success: true,
      message: 'Classroom created successfully',
      data: classroom,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update classroom
// @route   PUT /api/classrooms/:id
// @access  Private (Admin, Tendik)
exports.updateClassroom = async (req, res, next) => {
  try {
    let classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found',
      });
    }

    const { name, building, floor, capacity, facilities, isActive } = req.body;

    if (name) classroom.name = name;
    if (building) classroom.building = building;
    if (floor) classroom.floor = floor;
    if (capacity) classroom.capacity = capacity;
    if (facilities) classroom.facilities = facilities;
    if (typeof isActive !== 'undefined') classroom.isActive = isActive;

    await classroom.save();

    res.status(200).json({
      success: true,
      message: 'Classroom updated successfully',
      data: classroom,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete classroom
// @route   DELETE /api/classrooms/:id
// @access  Private (Admin)
exports.deleteClassroom = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found',
      });
    }

    // Soft delete
    classroom.isActive = false;
    await classroom.save();

    res.status(200).json({
      success: true,
      message: 'Classroom deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
