const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');


router.get('/', locationController.getLocations);


router.get('/add', locationController.getAddLocation); 

router.post('/add', locationController.postAddLocation);

router.get('/:id/edit', locationController.getEditLocation);

router.post('/:id/edit', locationController.postEditLocation);

router.post('/:id/delete', locationController.deleteLocation);

module.exports = router;