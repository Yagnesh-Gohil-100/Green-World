const PersonalUser = require('../models/PersonalUser');
const Business = require('../models/Business');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.userType;

    let user;
    switch (userType) {
      case 'personal':
        user = await PersonalUser.findById(userId).select('-password');
        break;
      case 'business':
        user = await Business.findById(userId).select('-password');
        break;
      case 'employee':
        user = await Employee.findById(userId).select('-password');
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid user type'
        });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name || user.businessName,
        email: user.email,
        userType: userType,
        createdAt: user.createdAt,
        profileImage: user.profileImage || null,
        ...(userType === 'employee' && { businessName: user.businessName }),
        ...(userType === 'business' && { businessName: user.businessName })
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching profile'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.userType;
    const { name, email } = req.body;

    let user;
    switch (userType) {
      case 'personal':
        user = await PersonalUser.findById(userId);
        break;
      case 'business':
        user = await Business.findById(userId);
        break;
      case 'employee':
        user = await Employee.findById(userId);
        break;
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      let existingUser;
      
      // Check all collections for email uniqueness
      existingUser = await PersonalUser.findOne({ email, _id: { $ne: userId } });
      if (!existingUser) existingUser = await Business.findOne({ email, _id: { $ne: userId } });
      if (!existingUser) existingUser = await Employee.findOne({ email, _id: { $ne: userId } });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email is already taken'
        });
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    // Return updated user without password
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userResponse
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating profile'
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.userType;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters'
      });
    }

    let user;
    switch (userType) {
      case 'personal':
        user = await PersonalUser.findById(userId).select('+password');
        break;
      case 'business':
        user = await Business.findById(userId).select('+password');
        break;
      case 'employee':
        user = await Employee.findById(userId).select('+password');
        break;
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while changing password'
    });
  }
};

// Update user settings
exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.userType;
    const { notifications, theme } = req.body;

    let user;
    switch (userType) {
      case 'personal':
        user = await PersonalUser.findById(userId);
        break;
      case 'business':
        user = await Business.findById(userId);
        break;
      case 'employee':
        user = await Employee.findById(userId);
        break;
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update settings
    user.settings = user.settings || {};
    if (notifications !== undefined) user.settings.notifications = notifications;
    if (theme) user.settings.theme = theme;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: user.settings
    });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating settings'
    });
  }
};

// Get user settings
exports.getSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.userType;

    let user;
    switch (userType) {
      case 'personal':
        user = await PersonalUser.findById(userId);
        break;
      case 'business':
        user = await Business.findById(userId);
        break;
      case 'employee':
        user = await Employee.findById(userId);
        break;
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user.settings || { notifications: true, theme: 'light' }
    });

  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching settings'
    });
  }
};