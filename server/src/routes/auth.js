const express = require('express');
const {
  registerPersonal,
  registerBusiness,
  registerEmployee,
  login,
  getMe,
  logout,
  verifyEmail,
  verifySecurityAnswer,
  resetPassword
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
// router.get('/verify-email/:token', verifyEmail);

// Add to your existing auth routes
router.post('/verify-email', verifyEmail);
router.post('/verify-security-answer', verifySecurityAnswer);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;