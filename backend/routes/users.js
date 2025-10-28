const express = require('express');
const {
  getUsers,
  getUser,
  updateProfile,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/stats', authorize('admin'), getUserStats);
router.get('/', authorize('admin'), getUsers);
router.get('/:id', getUser);
router.put('/profile', updateProfile);
router.delete('/:id', deleteUser);

module.exports = router;
