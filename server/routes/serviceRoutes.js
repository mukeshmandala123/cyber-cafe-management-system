const express = require("express");

const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const Service = require("../models/Service");

const router = express.Router();

// Get all services
router.get("/", async (req, res) => {
  try {
    let services = await Service.find().sort({ createdAt: 1 });

    if (services.length === 0) {
      const defaultServices = [
        {
          name: "Plain Printer",
          type: "Printer",
          ratePerPage: 5,
          status: "Available",
        },
        {
          name: "Colour Printer",
          type: "Printer",
          ratePerPage: 10,
          status: "Available",
        },
        {
          name: "Xerox",
          type: "Xerox",
          ratePerPage: 2,
          status: "Available",
        },
      ];

      services = await Service.insertMany(defaultServices);
    }

    res.json(services);
  } catch (error) {
    console.error("Get services error:", error);

    res.status(500).json({
      message: "Failed to fetch services",
      error: error.message,
    });
  }
});

// Get one service
router.get("/:id", getService);

// Create service
router.post("/", createService);

// Update service
router.put("/:id", updateService);

// Delete service
router.delete("/:id", deleteService);

module.exports = router;
