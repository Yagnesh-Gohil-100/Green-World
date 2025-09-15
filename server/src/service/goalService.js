const Goal = require("../models/Goal");

// Fetch latest goal for a user
const getLatestGoal = async (userId, userType) => {
  return await Goal.findOne({ userId, userType }).sort({ createdAt: -1 });
};

// Create a new goal for a user
const createGoal = async ({ userId, userType, transport, energy, waste }) => {
  const goal = new Goal({ userId, userType, transport, energy, waste });
  return await goal.save();
};

// Update goal for a user
const updateGoal = async ({ userId, userType, transport, energy, waste }) => {
  return await Goal.findOneAndUpdate(
    { userId, userType },
    { transport, energy, waste },
    { new: true, runValidators: true }
  );
};

module.exports = {
  getLatestGoal,
  createGoal,
  updateGoal
};