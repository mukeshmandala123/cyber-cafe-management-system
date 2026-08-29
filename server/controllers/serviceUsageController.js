const ServiceUsage = require("../models/ServiceUsage");
const Customer = require("../models/Customer");
const Service = require("../models/Service");

// Get all service usage records
const getServiceUsages = async (req, res) => {
  try {
    const usages = await ServiceUsage.find()
      .populate("customer")
      .populate("service")
      .sort({ createdAt: -1 });

    res.json(usages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one service usage record
const getServiceUsage = async (req, res) => {
  try {
    const usage = await ServiceUsage.findById(req.params.id)
      .populate("customer")
      .populate("service");

    if (!usage) {
      return res.status(404).json({
        message: "Service usage record not found",
      });
    }

    res.json(usage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create service usage
const createServiceUsage = async (req, res) => {
  try {
    const { customer, service, pages } = req.body;

    // Check customer
    const existingCustomer = await Customer.findById(customer);

    if (!existingCustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // Check service
    const existingService = await Service.findById(service);

    if (!existingService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Check service availability
    if (existingService.status !== "Available") {
      return res.status(400).json({
        message: "Service is not available",
      });
    }

    // Calculate total
    const totalAmount = pages * existingService.ratePerPage;

    // Create usage record
    const usage = await ServiceUsage.create({
      customer,
      service,
      pages,
      ratePerPage: existingService.ratePerPage,
      totalAmount,
    });

    // Return populated record
    const populatedUsage = await ServiceUsage.findById(usage._id)
      .populate("customer")
      .populate("service");

    res.status(201).json(populatedUsage);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Delete service usage record
const deleteServiceUsage = async (req, res) => {
  try {
    const usage = await ServiceUsage.findByIdAndDelete(req.params.id);

    if (!usage) {
      return res.status(404).json({
        message: "Service usage record not found",
      });
    }

    res.json({
      message: "Service usage record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getServiceUsages,
  getServiceUsage,
  createServiceUsage,
  deleteServiceUsage,
};