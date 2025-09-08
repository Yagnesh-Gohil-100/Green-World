const express = require('express');
const {
  register,
  verifyEmail
} = require('../controllers/authController');
const {
  validateSignup,
  handleValidationErrors
} = require('../middleware/validation');

const router = express.Router();

router.post('/signup', validateSignup, handleValidationErrors, register);
router.get('/verify-email/:token', verifyEmail);

module.exports = router;