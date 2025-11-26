const express = require('express');
const router = express.Router();
const {
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule
} = require('../controllers/scheduleController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Public (authenticated) routes
router.get('/', getSchedules);
router.get('/:id', getSchedule);

// Admin only routes
router.post(
  '/',
  authorize('admin'),
  createSchedule
);

router.put(
  '/:id',
  authorize('admin'),
  updateSchedule
);

router.delete(
  '/:id',
  authorize('admin'),
  deleteSchedule
);

module.exports = router;
