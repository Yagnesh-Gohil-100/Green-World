const CarbonFootprintService = require("../service/carbonFootprintService");

// POST /api/carbon-footprint - Create new carbon footprint entry
const createCarbonFootprint = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const userType = req.userType === 'personal' ? 'PersonalUser' : 
                    req.userType === 'business' ? 'Business' : 'Employee';
    const { transport, energy, waste } = req.body;

    const carbonEntry = await CarbonFootprintService.createCarbonFootprint({
      userId,
      userType,
      transport: Number(transport),
      energy: Number(energy),
      waste: Number(waste)
    });

    res.status(201).json({
      success: true,
      message: "Carbon footprint data saved successfully",
      data: carbonEntry
    });
  } catch (err) {
    console.error("Create carbon footprint error:", err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: errors[0]
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: "Server error while saving carbon data" 
    });
  }
};

// GET /api/carbon-footprint - Get user's carbon footprint data
const getCarbonFootprints = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const userType = req.userType === 'personal' ? 'PersonalUser' : 
                    req.userType === 'business' ? 'Business' : 'Employee';
    const { limit = 30 } = req.query;

    const carbonData = await CarbonFootprintService.getUserCarbonFootprints(
      userId, 
      userType, 
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      data: carbonData
    });
  } catch (err) {
    console.error("Get carbon footprints error:", err);
    res.status(500).json({ 
      success: false, 
      error: "Server error while fetching carbon data" 
    });
  }
};

// GET /api/carbon-footprint/summary - Get carbon footprint summary
const getCarbonSummary = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const userType = req.userType === 'personal' ? 'PersonalUser' : 
                    req.userType === 'business' ? 'Business' : 'Employee';
    const { days = 30 } = req.query;

    const summary = await CarbonFootprintService.getCarbonSummary(
      userId, 
      userType, 
      parseInt(days)
    );

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (err) {
    console.error("Get carbon summary error:", err);
    res.status(500).json({ 
      success: false, 
      error: "Server error while fetching carbon summary" 
    });
  }
};

// GET /api/carbon-footprint/latest - Get latest carbon footprint
const getLatestCarbonFootprint = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const userType = req.userType === 'personal' ? 'PersonalUser' : 
                    req.userType === 'business' ? 'Business' : 'Employee';

    const latestEntry = await CarbonFootprintService.getLatestCarbonFootprint(
      userId, 
      userType
    );

    res.status(200).json({
      success: true,
      data: latestEntry
    });
  } catch (err) {
    console.error("Get latest carbon footprint error:", err);
    res.status(500).json({ 
      success: false, 
      error: "Server error while fetching latest carbon data" 
    });
  }
};

// DELETE /api/carbon-footprint/:id - Delete carbon footprint entry
const deleteCarbonFootprint = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id } = req.params;

    const deletedEntry = await CarbonFootprintService.deleteCarbonFootprint(id, userId);

    if (!deletedEntry) {
      return res.status(404).json({
        success: false,
        error: "Carbon footprint entry not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Carbon footprint entry deleted successfully"
    });
  } catch (err) {
    console.error("Delete carbon footprint error:", err);
    res.status(500).json({ 
      success: false, 
      error: "Server error while deleting carbon data" 
    });
  }
};

module.exports = {
  createCarbonFootprint,
  getCarbonFootprints,
  getCarbonSummary,
  getLatestCarbonFootprint,
  deleteCarbonFootprint
};