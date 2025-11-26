const express = require('express');
const router = express.Router();
const {
  getClassrooms,
  getClassroom,
  getClassroomAvailability,
  createClassroom,
  updateClassroom,
  deleteClassroom
} = require('../controllers/classroomController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Public (authenticated) routes
router.get('/', getClassrooms);
router.get('/:id', getClassroom);
router.get('/:id/availability', getClassroomAvailability);

// Admin/Tendik routes
router.post(
  '/',
  authorize('admin', 'tendik'),
  createClassroom
);

router.put(
  '/:id',
  authorize('admin', 'tendik'),
  updateClassroom
);

router.delete(
  '/:id',
  authorize('admin'),
  deleteClassroom
);

module.exports = router;
