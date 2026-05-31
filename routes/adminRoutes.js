const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const { protect, restrictTo } = require('../middlewares/authMiddleware');


router.get('/users', protect, restrictTo('admin'), adminController.getUsers);

router.post('/users/:id/role', protect, restrictTo('admin'), adminController.updateRole);

module.exports = router;