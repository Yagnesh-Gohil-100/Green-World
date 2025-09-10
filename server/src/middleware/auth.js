const jwt = require('jsonwebtoken');
const PersonalUser = require('../models/PersonalUser');
const Business = require('../models/Business');
const Employee = require('../models/Employee');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      let user;
      
      // Get user based on type
      switch (decoded.modelType) {
        case 'personal':
          user = await PersonalUser.findById(decoded.id);
          break;
        case 'business':
          user = await Business.findById(decoded.id);
          break;
        case 'employee':
          user = await Employee.findById(decoded.id);
          break;
        default:
          return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
          });
      }
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to access this route'
        });
      }

      req.user = user;
      req.userType = decoded.modelType;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Grant access to specific user types
exports.authorize = (...userTypes) => {
  return (req, res, next) => {
    if (!userTypes.includes(req.userType)) {
      return res.status(403).json({
        success: false,
        error: `User type ${req.userType} is not authorized to access this route`
      });
    }
    next();
  };
};