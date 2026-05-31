const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

const { protect, restrictTo } = require('../middlewares/authMiddleware');


const multer = require('multer');
const upload = multer({ dest: 'uploads/' });




router.get('/', eventController.getEvents);
router.get('/add', protect, restrictTo('organizator', 'admin'), eventController.getAddEvent);


router.post('/add', protect, restrictTo('organizator', 'admin'), upload.single('image'), eventController.postAddEvent);


router.get('/:id/edit', protect, restrictTo('organizator', 'admin'), eventController.getEditEvent);

router.post('/:id/edit', protect, restrictTo('organizator', 'admin'), upload.single('image'), eventController.postEditEvent);

router.post('/:id/delete', protect, restrictTo('organizator', 'admin'), eventController.deleteEvent);

module.exports = router;