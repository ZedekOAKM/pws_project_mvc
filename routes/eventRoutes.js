const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');


const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/add-event', protect, restrictTo('organizator', 'admin'), eventController.getAddEvent);

router.post('/add-event', protect, restrictTo('organizator', 'admin'), upload.single('image'), eventController.postAddEvent);

router.get('/events', eventController.getEvents);

module.exports = router;