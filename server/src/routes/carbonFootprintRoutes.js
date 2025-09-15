const express = require("express");
const router = express.Router();
const {
  createCarbonFootprint,
  getCarbonFootprints,
  getCarbonSummary,
  getLatestCarbonFootprint,
  deleteCarbonFootprint
} = require("../controllers/carbonFootprintController");
const { protect } = require("../middleware/auth");

// All routes are protected
router.use(protect);

// POST /api/carbon-footprint - Create new carbon footprint entry
router.post("/", createCarbonFootprint);

// GET /api/carbon-footprint - Get user's carbon footprint data
router.get("/", getCarbonFootprints);

// GET /api/carbon-footprint/summary - Get carbon footprint summary
router.get("/summary", getCarbonSummary);

// GET /api/carbon-footprint/latest - Get latest carbon footprint
router.get("/latest", getLatestCarbonFootprint);

// DELETE /api/carbon-footprint/:id - Delete carbon footprint entry
router.delete("/:id", deleteCarbonFootprint);

module.exports = router;