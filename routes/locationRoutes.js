const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Zobrazení všech míst
router.get('/', locationController.getLocations);

// Formulář pro přidání místa (ZDE BYLA CHYBA - odkaz na novou funkci)
router.get('/add', locationController.getAddLocation); 

// Zpracování formuláře pro přidání místa
router.post('/add', locationController.postAddLocation);

// Formulář pro editaci místa
router.get('/:id/edit', locationController.getEditLocation);

// Zpracování editace místa
router.post('/:id/edit', locationController.postEditLocation);

// Mazání místa
router.post('/:id/delete', locationController.deleteLocation);

module.exports = router;