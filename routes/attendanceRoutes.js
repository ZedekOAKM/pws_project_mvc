const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/events/:id/attend', protect, attendanceController.attendEvent);
router.post('/events/:id/unattend', protect, attendanceController.unattendEvent);

module.exports = router;