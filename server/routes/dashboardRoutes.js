const express = require("express");

const {
  getDashboardStats,
} = require("../controllers/dashboardController");

const router = express.Router();

// Get dashboard statistics
router.get("/", getDashboardStats);

module.exports = router;