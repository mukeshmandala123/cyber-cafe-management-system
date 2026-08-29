const express = require("express");

const {
  getServiceUsages,
  getServiceUsage,
  createServiceUsage,
  deleteServiceUsage,
} = require("../controllers/serviceUsageController");

const router = express.Router();

// Get all service usage records
router.get("/", getServiceUsages);

// Get one service usage record
router.get("/:id", getServiceUsage);

// Create service usage
router.post("/", createServiceUsage);

// Delete service usage record
router.delete("/:id", deleteServiceUsage);

module.exports = router;