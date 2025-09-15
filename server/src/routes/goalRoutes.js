// routes/goalRoutes.js
const express = require("express");
const router = express.Router();
const {
  getLatestGoal,
  saveGoal
} = require("../controllers/goalController");
const { protect } = require("../middleware/auth");

// All routes are protected
router.use(protect);

// GET /api/goals - Get latest goal
router.get("/", getLatestGoal);

// POST /api/goals - Create or update goal
router.post("/", saveGoal);

// PUT /api/goals - Create or update goal (alternative)
router.put("/", saveGoal);

module.exports = router;