const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

const { protect, restrictTo } = require('../middlewares/authMiddleware');


const multer = require('multer');
const upload = multer({ dest: 'uploads/' });



// Zobrazení seznamu akcí -> GET /events
router.get('/', eventController.getEvents);

// Formulář pro novou akci -> GET /events/add
router.get('/add', protect, restrictTo('organizator', 'admin'), eventController.getAddEvent);

// Zpracování nové akce + nahrání obrázku -> POST /events/add
router.post('/add', protect, restrictTo('organizator', 'admin'), upload.single('image'), eventController.postAddEvent);

// Formulář pro editaci akce -> GET /events/:id/edit
router.get('/:id/edit', protect, restrictTo('organizator', 'admin'), eventController.getEditEvent);

// Zpracování editace akce + nahrání obrázku -> POST /events/:id/edit
router.post('/:id/edit', protect, restrictTo('organizator', 'admin'), upload.single('image'), eventController.postEditEvent);

// Smazání akce -> POST /events/:id/delete
router.post('/:id/delete', protect, restrictTo('organizator', 'admin'), eventController.deleteEvent);

module.exports = router;