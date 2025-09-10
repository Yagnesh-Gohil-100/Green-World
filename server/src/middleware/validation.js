const { body, validationResult } = require('express-validator');

// Common validation rules
const emailValidation = body('email')
  .isEmail()
  .withMessage('Please enter a valid email')
  .normalizeEmail();

const passwordValidation = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');

// Personal registration validation
exports.validatePersonalRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  emailValidation,
  passwordValidation
];

// Business registration validation
exports.validateBusinessRegistration = [
  body('organization')
    .trim()
    .notEmpty()
    .withMessage('Organization name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Organization name must be between 2 and 100 characters'),
  emailValidation,
  passwordValidation
];

// Employee registration validation
exports.validateEmployeeRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('organization')
    .trim()
    .notEmpty()
    .withMessage('Organization name is required'),
  emailValidation,
  passwordValidation
];

// Login validation
exports.validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  body('userType')
    .isIn(['personal', 'business', 'employee'])
    .withMessage('User type must be personal, business, or employee')
];

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg,
      field: errors.array()[0].param
    });
  }
  next();
};