const express = require("express");

const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const router = express.Router();

// Get all services
router.get("/", getServices);

// Get one service
router.get("/:id", getService);

// Create service
router.post("/", createService);

// Update service
router.put("/:id", updateService);

// Delete service
router.delete("/:id", deleteService);

module.exports = router;
