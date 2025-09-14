const express = require('express');
const {
  getUserProfile,
  updateProfile,
  changePassword,
  updateSettings,
  getSettings
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;