const CarbonFootprint = require("../models/CarbonFootprint");

// Create new carbon footprint entry
const createCarbonFootprint = async ({ userId, userType, transport, energy, waste }) => {
  const carbonEntry = new CarbonFootprint({
    userId,
    userType,
    transport,
    energy,
    waste
  });
  return await carbonEntry.save();
};

// Get carbon footprint entries for a user
const getUserCarbonFootprints = async (userId, userType, limit = 30) => {
  return await CarbonFootprint.find({ userId, userType })
    .sort({ date: -1 })
    .limit(limit)
    .lean();
};

// Get latest carbon footprint for a user
const getLatestCarbonFootprint = async (userId, userType) => {
  return await CarbonFootprint.findOne({ userId, userType })
    .sort({ date: -1 })
    .lean();
};

// Get carbon footprint summary (totals, averages)
const getCarbonSummary = async (userId, userType, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const entries = await CarbonFootprint.find({
    userId,
    userType,
    date: { $gte: startDate }
  }).lean();

  const totals = entries.reduce((acc, entry) => ({
    transport: acc.transport + entry.transport,
    energy: acc.energy + entry.energy,
    waste: acc.waste + entry.waste,
    count: acc.count + 1
  }), { transport: 0, energy: 0, waste: 0, count: 0 });

  const averages = {
    transport: totals.count > 0 ? totals.transport / totals.count : 0,
    energy: totals.count > 0 ? totals.energy / totals.count : 0,
    waste: totals.count > 0 ? totals.waste / totals.count : 0
  };

  return { entries, totals, averages };
};

// Delete a carbon footprint entry
const deleteCarbonFootprint = async (entryId, userId) => {
  return await CarbonFootprint.findOneAndDelete({ 
    _id: entryId, 
    userId 
  });
};

module.exports = {
  createCarbonFootprint,
  getUserCarbonFootprints,
  getLatestCarbonFootprint,
  getCarbonSummary,
  deleteCarbonFootprint
};