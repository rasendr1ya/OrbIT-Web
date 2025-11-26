const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(protect);

// Public (authenticated) routes
router.get('/', getAnnouncements);
router.get('/:id', getAnnouncement);

// Dosen+ routes
router.post(
  '/',
  authorize('dosen', 'tendik', 'admin'),
  upload.array('files', 5), // Max 5 files
  createAnnouncement
);

router.put(
  '/:id',
  authorize('dosen', 'tendik', 'admin'),
  updateAnnouncement
);

router.delete(
  '/:id',
  authorize('dosen', 'tendik', 'admin'),
  deleteAnnouncement
);

module.exports = router;
