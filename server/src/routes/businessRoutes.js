const express = require("express");
const router = express.Router();
const {
  getTeamStats,
  getEmployeeDetails,
  getAllEmployees
} = require("../controllers/businessController");
const { protect, authorize } = require("../middleware/auth");

// All routes are protected
router.use(protect);

// Employee routes
router.get("/team-stats", authorize('employee'), getTeamStats);

// Business admin routes
router.get("/employees", authorize('business'), getAllEmployees);
router.get("/employees/:employeeId", authorize('business'), getEmployeeDetails);

module.exports = router;