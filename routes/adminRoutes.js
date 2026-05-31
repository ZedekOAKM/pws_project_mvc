const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/admin/users', protect, restrictTo('admin'), adminController.getUsers);
router.post('/admin/users/:id/role', protect, restrictTo('admin'), adminController.updateRole);

module.exports = router;