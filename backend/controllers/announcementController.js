const Announcement = require('../models/Announcement');
const path = require('path');

// @desc    Get all announcements (with filters)
// @route   GET /api/announcements
// @access  Private
exports.getAnnouncements = async (req, res, next) => {
  try {
    const { category, priority, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Pagination
    const skip = (page - 1) * limit;

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'fullName email primaryRole')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Announcement.countDocuments(query);

    res.status(200).json({
      success: true,
      count: total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
      data: announcements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Private
exports.getAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'fullName email primaryRole');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    // Increment view count
    announcement.viewCount += 1;
    await announcement.save();

    res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private (Dosen, Tendik, Admin)
exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, description, category, priority, targetRoles, startDate, endDate } = req.body;

    // Parse targetRoles if it's a string
    let parsedTargetRoles = targetRoles;
    if (typeof targetRoles === 'string') {
      parsedTargetRoles = JSON.parse(targetRoles);
    }

    // Handle file attachments
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => ({
        fileName: file.originalname,
        fileUrl: `/uploads/announcements/${file.filename}`,
        fileType: file.mimetype,
        uploadedAt: new Date(),
      }));
    }

    const announcement = await Announcement.create({
      title,
      description,
      category,
      priority: priority || 'normal',
      targetRoles: parsedTargetRoles || ['all'],
      attachments,
      createdBy: req.user.id,
      startDate,
      endDate,
    });

    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('createdBy', 'fullName email');

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: populatedAnnouncement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Creator or Admin)
exports.updateAnnouncement = async (req, res, next) => {
  try {
    let announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    // Check ownership or admin
    if (announcement.createdBy.toString() !== req.user.id && req.user.primaryRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this announcement',
      });
    }

    const { title, description, category, priority, targetRoles, startDate, endDate, isActive } = req.body;

    // Update fields
    if (title) announcement.title = title;
    if (description) announcement.description = description;
    if (category) announcement.category = category;
    if (priority) announcement.priority = priority;
    if (targetRoles) announcement.targetRoles = targetRoles;
    if (startDate) announcement.startDate = startDate;
    if (endDate) announcement.endDate = endDate;
    if (typeof isActive !== 'undefined') announcement.isActive = isActive;

    await announcement.save();

    announcement = await Announcement.findById(announcement._id)
      .populate('createdBy', 'fullName email');

    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete announcement (soft delete)
// @route   DELETE /api/announcements/:id
// @access  Private (Creator or Admin)
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    // Check ownership or admin
    if (announcement.createdBy.toString() !== req.user.id && req.user.primaryRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this announcement',
      });
    }

    // Soft delete
    announcement.isActive = false;
    await announcement.save();

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
