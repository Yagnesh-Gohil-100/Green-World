// controllers/goalController.js - MUST USE THIS EXACT CODE
const Goal = require("../models/Goal");

// GET latest goal for authenticated user
exports.getLatestGoal = async (req, res) => {
  try {

    const userId = req.user._id; // CHANGED FROM req.user.id to req.user._id
    const userType = req.userType === 'personal' ? 'PersonalUser' : 
                    req.userType === 'business' ? 'Business' : 'Employee';
    
    const goal = await Goal.findOne({ userId, userType }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: goal // This can be null if no goals exist
    });
  } catch (err) {
    console.error("Get goal error:", err);
    res.status(500).json({ 
      success: false, 
      error: "Server error while fetching goals" 
    });
  }
};

// CREATE or UPDATE goal for authenticated user
exports.saveGoal = async (req, res) => {
  try {

    console.log('GET Goals - User:', req.user);
    console.log('GET Goals - UserId:', req.user._id);
    console.log('GET Goals - UserType:', req.userType);

    const userId = req.user._id; // CHANGED FROM req.user.id to req.user._id
    const userType = req.userType === 'personal' ? 'PersonalUser' : 
                    req.userType === 'business' ? 'Business' : 'Employee';
    const { transport, energy, waste } = req.body;

    // Validate required fields
    if (transport === undefined || energy === undefined || waste === undefined) {
      return res.status(400).json({
        success: false,
        error: "Transport, energy, and waste values are required"
      });
    }

    // Find existing goal or create new one
    let goal = await Goal.findOne({ userId, userType });

    if (goal) {
      // Update existing goal
      goal.transport = Number(transport);
      goal.energy = Number(energy);
      goal.waste = Number(waste);
    } else {
      // Create new goal
      goal = new Goal({
        userId,
        userType,
        transport: Number(transport),
        energy: Number(energy),
        waste: Number(waste)
      });
    }

    const savedGoal = await goal.save();

    res.status(200).json({
      success: true,
      message: goal.isNew ? "Goals created successfully" : "Goals updated successfully",
      data: savedGoal
    });
  } catch (err) {
    console.error("Save goal error:", err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: errors[0]
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: "Server error while saving goals" 
    });
  }
};