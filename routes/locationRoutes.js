const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/locations', locationController.getLocations);

// Přidání místa
router.post('/add-location', protect, restrictTo('organizator', 'admin'), locationController.postAddLocation);


router.get('/locations/:id/edit', protect, restrictTo('admin', 'organizator'), locationController.getEditLocation);
router.post('/locations/:id/edit', protect, restrictTo('admin', 'organizator'), locationController.postEditLocation);

// Smazání místa konání
router.post('/locations/:id/delete', protect, restrictTo('admin', 'organizator'), locationController.deleteLocation);

module.exports = router;