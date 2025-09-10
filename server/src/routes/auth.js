const express = require('express');
const {
  registerPersonal,
  registerBusiness,
  registerEmployee,
  login,
  getMe,
  logout,
  verifyEmail
} = require('../controllers/authController');
const {
  validatePersonalRegistration,
  validateBusinessRegistration,
  validateEmployeeRegistration,
  validateLogin,
  handleValidationErrors
} = require('../middleware/validation');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register/personal', validatePersonalRegistration, handleValidationErrors, registerPersonal);
router.post('/register/business_admin', validateBusinessRegistration, handleValidationErrors, registerBusiness);
router.post('/register/business_employee', validateEmployeeRegistration, handleValidationErrors, registerEmployee);
router.post('/login', validateLogin, handleValidationErrors, login);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;