const communityService = require('../service/communityService');

// Get all tips
exports.getTips = async (req, res) => {
  try {
    const { category, search } = req.query;
    const tips = await communityService.getAllTips(category, search);
    
    res.status(200).json({
      success: true,
      count: tips.length,
      data: tips // Changed from 'tips' to 'data'
    });
  } catch (error) {
    console.error('Get tips error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching tips'
    });
  }
};

// Create a new tip
exports.createTip = async (req, res) => {
  try {
    const tipData = {
      ...req.body,
      authorId: req.user.id,
      authorName: req.user.name || req.user.organization
    };

    const tip = await communityService.createTip(tipData);
    
    res.status(201).json({
      success: true,
      message: 'Tip created successfully',
      data: tip // Changed from 'tip' to 'data'
    });
  } catch (error) {
    console.error('Create tip error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating tip'
    });
  }
};

// Like a tip
exports.likeTip = async (req, res) => {
  try {
    const tip = await communityService.toggleLike(req.params.id, req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Tip liked successfully',
      data: tip // Changed from 'tip' to 'data'
    });
  } catch (error) {
    console.error('Like tip error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while liking tip'
    });
  }
};

// Dislike a tip
exports.dislikeTip = async (req, res) => {
  try {
    const tip = await communityService.toggleDislike(req.params.id, req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Tip disliked successfully',
      data: tip // Changed from 'tip' to 'data'
    });
  } catch (error) {
    console.error('Dislike tip error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while disliking tip'
    });
  }
};

// Rate a tip
exports.rateTip = async (req, res) => {
  try {
    const { value } = req.body;
    const tip = await communityService.addRating(req.params.id, req.user.id, value);
    
    res.status(200).json({
      success: true,
      message: 'Tip rated successfully',
      data: tip // Changed from 'tip' to 'data'
    });
  } catch (error) {
    console.error('Rate tip error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while rating tip'
    });
  }
};

// Add comment to a tip
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const commentData = {
      authorId: req.user.id,
      authorName: req.user.name || req.user.businessName,
      text
    };

    const tip = await communityService.addComment(req.params.id, commentData);
    
    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      data: tip // Changed from 'tip' to 'data'
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while adding comment'
    });
  }
};

// Delete a tip
exports.deleteTip = async (req, res) => {
  try {
    const result = await communityService.deleteTip(req.params.id, req.user.id);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Delete tip error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while deleting tip'
    });
  }
};

// Get single tip
exports.getTip = async (req, res) => {
  try {
    const tip = await communityService.getTipById(req.params.id);
    
    if (!tip) {
      return res.status(404).json({
        success: false,
        error: 'Tip not found'
      });
    }

    res.status(200).json({
      success: true,
      data: tip // Changed from 'tip' to 'data'
    });
  } catch (error) {
    console.error('Get tip error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching tip'
    });
  }
};