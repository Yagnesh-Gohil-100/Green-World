const Tip = require('../models/Tip');

const communityService = {};

// Create a new tip
communityService.createTip = async (tipData) => {
  const tip = new Tip(tipData);
  return await tip.save();
};

// Get all tips with optional filtering
communityService.getAllTips = async (category, searchQuery) => {
  let query = {};

  if (category && category !== 'All Tips') {
    query.category = category;
  }

  if (searchQuery && searchQuery.trim() !== '') {
    query.$or = [
      { title: { $regex: searchQuery, $options: 'i' } },
      { content: { $regex: searchQuery, $options: 'i' } },
      { authorName: { $regex: searchQuery, $options: 'i' } }
    ];
  }

  // REMOVED ALL .populate() CALLS
  return await Tip.find(query).sort({ createdAt: -1 });
};

// Toggle like on a tip
communityService.toggleLike = async (tipId, userId) => {
  const tip = await Tip.findById(tipId);
  if (!tip) throw new Error('Tip not found');

  const userIndex = tip.likes.indexOf(userId);
  
  if (userIndex > -1) {
    // Remove like
    tip.likes.splice(userIndex, 1);
  } else {
    // Add like and remove dislike if exists
    tip.likes.push(userId);
    const dislikeIndex = tip.dislikes.indexOf(userId);
    if (dislikeIndex > -1) {
      tip.dislikes.splice(dislikeIndex, 1);
    }
  }

  return await tip.save();
};

// Toggle dislike on a tip
communityService.toggleDislike = async (tipId, userId) => {
  const tip = await Tip.findById(tipId);
  if (!tip) throw new Error('Tip not found');

  const userIndex = tip.dislikes.indexOf(userId);
  
  if (userIndex > -1) {
    // Remove dislike
    tip.dislikes.splice(userIndex, 1);
  } else {
    // Add dislike and remove like if exists
    tip.dislikes.push(userId);
    const likeIndex = tip.likes.indexOf(userId);
    if (likeIndex > -1) {
      tip.likes.splice(likeIndex, 1);
    }
  }

  return await tip.save();
};

// Add or update rating
communityService.addRating = async (tipId, userId, value) => {
  const tip = await Tip.findById(tipId);
  if (!tip) throw new Error('Tip not found');

  // Remove existing rating by this user
  tip.ratings = tip.ratings.filter(r => r.userId.toString() !== userId);
  
  // Add new rating
  tip.ratings.push({ userId, value });

  return await tip.save();
};

// Add comment to a tip
communityService.addComment = async (tipId, commentData) => {
  const tip = await Tip.findById(tipId);
  if (!tip) throw new Error('Tip not found');

  tip.comments.push({
    ...commentData,
    createdAt: new Date()
  });

  return await tip.save();
};

// Delete a tip
communityService.deleteTip = async (tipId, userId) => {
  const tip = await Tip.findById(tipId);
  if (!tip) throw new Error('Tip not found');

  if (tip.authorId.toString() !== userId) {
    throw new Error("Not authorized to delete this tip");
  }

  await Tip.findByIdAndDelete(tipId);
  return { message: "Tip deleted successfully" };
};

// Get tip by ID
communityService.getTipById = async (tipId) => {
  // REMOVED .populate() CALLS
  return await Tip.findById(tipId);
};

module.exports = communityService;