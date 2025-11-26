const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBooking,
  createBooking,
  approveBooking,
  rejectBooking,
  cancelBooking,
  getCalendarEvents
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Public (authenticated) routes
router.get('/', getBookings);
router.get('/calendar', getCalendarEvents);
router.get('/:id', getBooking);
router.post('/', createBooking);
router.delete('/:id', cancelBooking);

// Tendik/Admin routes
router.put(
  '/:id/approve',
  authorize('tendik', 'admin'),
  approveBooking
);

router.put(
  '/:id/reject',
  authorize('tendik', 'admin'),
  rejectBooking
);

module.exports = router;
