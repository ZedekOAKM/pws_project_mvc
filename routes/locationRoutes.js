const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// ZOBRAZENÍ FORMULÁŘE
router.get('/add-location', protect, restrictTo('organizator', 'admin'), locationController.getAddLocation);


router.post('/add-location', protect, restrictTo('organizator', 'admin'), locationController.postAddLocation);

router.get('/locations', locationController.getLocations);

module.exports = router;