const PersonalUser = require('../models/PersonalUser');
const Business = require('../models/Business');
const Employee = require('../models/Employee');
const { sendEmail } = require('../utilities/emailService');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Generate token
const generateToken = (id, modelType) => {
  return jwt.sign({ id, modelType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Send token response
const sendTokenResponse = (user, modelType, statusCode, res) => {
  const token = generateToken(user._id, modelType);
  
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      userType: modelType,
      data: {
        id: user._id,
        name: user.name || user.organization,
        email: user.email
      }
    });
};

// Personal User Registration
exports.registerPersonal = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await PersonalUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email',
        field: 'email'
      });
    }

    // Create user
    const user = await PersonalUser.create({ name, email, password });

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    // // Send verification email
    // try {
    //   await sendEmail({
    //     email: user.email,
    //     subject: 'Email Verification - Ecotrackify',
    //     message: `Please verify your email by clicking: ${process.env.FRONTEND_URL}/verify-email/${verificationToken}`
    //   });
    // } catch (emailError) {
    //   console.error('Email sending failed:', emailError);
    // }

    sendTokenResponse(user, 'personal', 201, res);

  } catch (error) {
    // MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists',
        field: 'email'
      });
    }
    
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: errors[0],
        field: Object.keys(error.errors)[0]
      });
    }

    console.error('Personal registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
};

// Business Registration
exports.registerBusiness = async (req, res, next) => {
  try {
    const { organization, email, password } = req.body;

    // Check if business exists
    const existingBusiness = await Business.findOne({ 
      $or: [{ email }, { organization }] 
    });

    if (existingBusiness) {
      const field = existingBusiness.email === email ? 'email' : 'organization';
      return res.status(400).json({
        success: false,
        error: `Business with this ${field} already exists`,
        field
      });
    }

    // Create business
    const business = await Business.create({ organization, email, password });

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    business.verificationToken = verificationToken;
    await business.save();

    // // Send verification email
    // try {
    //   await sendEmail({
    //     email: business.email,
    //     subject: 'Business Verification - Ecotrackify',
    //     message: `Please verify your business by clicking: ${process.env.FRONTEND_URL}/verify-business/${verificationToken}`
    //   });
    // } catch (emailError) {
    //   console.error('Email sending failed:', emailError);
    // }

    sendTokenResponse(business, 'business', 201, res);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Business name or email already exists',
        field: error.keyValue.email ? 'email' : 'organization'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: errors[0],
        field: Object.keys(error.errors)[0]
      });
    }

    console.error('Business registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during business registration'
    });
  }
};

// Employee Registration
exports.registerEmployee = async (req, res, next) => {
  try {
    const { name, organization, email, password } = req.body;

    // Check if business exists
    const business = await Business.findOne({ organization });
    if (!business) {
      return res.status(400).json({
        success: false,
        error: 'Business does not exist',
        field: 'organization'
      });
    }

    // Check if employee exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        error: 'Employee already exists with this email',
        field: 'email'
      });
    }

    // Create employee
    const employee = await Employee.create({ 
      name, 
      email, 
      password, 
      organization,
      organizationId: business._id
    });

    // Update business employee count
    business.numberOfEmployees += 1;
    await business.save();

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    employee.verificationToken = verificationToken;
    await employee.save();

    // // Send verification email
    // try {
    //   await sendEmail({
    //     email: employee.email,
    //     subject: 'Employee Registration - Ecotrackify',
    //     message: `You have been registered as an employee of ${organization}. Please verify your email: ${process.env.FRONTEND_URL}/verify-email/${verificationToken}`
    //   });
    // } catch (emailError) {
    //   console.error('Email sending failed:', emailError);
    // }

    sendTokenResponse(employee, 'employee', 201, res);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists',
        field: 'email'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: errors[0],
        field: Object.keys(error.errors)[0]
      });
    }

    console.error('Employee registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during employee registration'
    });
  }
};

// Unified Login
exports.login = async (req, res, next) => {
  try {
    const { email, password, userType } = req.body;

    let user;
    let model;

    // Determine which model to use
    switch (userType) {
      case 'personal':
        model = PersonalUser;
        break;
      case 'business':
        model = Business;
        break;
      case 'employee':
        model = Employee;
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid user type',
          field: 'userType'
        });
    }

    // Find user and include password
    user = await model.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        field: 'email'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        field: 'password'
      });
    }

    // // Check verification status
    // if (!user.isVerified) {
    //   return res.status(401).json({
    //     success: false,
    //     error: 'Please verify your email before logging in',
    //     requiresVerification: true
    //   });
    // }

    sendTokenResponse(user, userType, 200, res);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
};

// Get current user
exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
      userType: req.userType
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Logout user
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during logout'
    });
  }
};

// Verify email and return security question
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Check all user models
    let user = await PersonalUser.findOne({ email });
    let userModel = 'PersonalUser';
    
    if (!user) {
      user = await Business.findOne({ email });
      userModel = 'Business';
    }
    
    if (!user) {
      user = await Employee.findOne({ email });
      userModel = 'Employee';
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No account found with this email'
      });
    }

    // For simplicity, using a fixed security question
    // In real app, you'd store this in user model
    res.status(200).json({
      success: true,
      securityQuestion: "What is your mother's maiden name?"
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during email verification'
    });
  }
};

// Verify security answer
exports.verifySecurityAnswer = async (req, res, next) => {
  try {
    const { email, securityAnswer } = req.body;

    if (!email || !securityAnswer) {
      return res.status(400).json({
        success: false,
        error: 'Email and security answer are required'
      });
    }

    // For simplicity, using a fixed answer
    // In real app, you'd verify against stored answer
    const correctAnswer = "MERN"; // Example answer

    if (securityAnswer.toLowerCase() !== correctAnswer.toLowerCase()) {
      return res.status(400).json({
        success: false,
        error: 'Incorrect security answer'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Security answer verified'
    });

  } catch (error) {
    console.error('Security answer verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during security verification'
    });
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Email and new password are required'
      });
    }

    // Find user in all models
    let user = await PersonalUser.findOne({ email });
    
    if (!user) {
      user = await Business.findOne({ email });
    }
    
    if (!user) {
      user = await Employee.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No account found with this email'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during password reset'
    });
  }
};