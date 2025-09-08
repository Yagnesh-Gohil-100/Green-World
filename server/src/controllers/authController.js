const User = require('../models/User');
const crypto = require('crypto');
const { sendEmail } = require('../utilities/emailService');

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  
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
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });
};

// Register user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, userType } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      userType: userType || 'personal'
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    // Send verification email
    // const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
    
    // try {
    //   await sendEmail({
    //     email: user.email,
    //     subject: 'Email Verification - Ecotrackify',
    //     message: `Please verify your email by clicking on the link: ${verificationUrl}`
    //   });
    // } catch (emailError) {
    //   console.error('Email sending failed:', emailError);
    //   // Continue with registration even if email fails
    // }

    sendTokenResponse(user, 201, res);

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
};

// Verify email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      isVerified: false
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token'
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during email verification'
    });
  }
};