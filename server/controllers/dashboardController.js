const Customer = require("../models/Customer");
const Terminal = require("../models/Terminal");
const Session = require("../models/Session");
const ServiceUsage = require("../models/ServiceUsage");

// Get dashboard summary
const getDashboardStats = async (req, res) => {
  try {
    // Total customers
    const totalCustomers = await Customer.countDocuments();

    // Terminal counts
    const totalTerminals = await Terminal.countDocuments();
    const availableTerminals = await Terminal.countDocuments({
      status: "Available",
    });
    const occupiedTerminals = await Terminal.countDocuments({
      status: "Occupied",
    });

    // Active sessions
    const activeSessions = await Session.countDocuments({
      status: "Active",
    });

    // Start of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // End of today
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Today's completed session revenue
    const sessionRevenueResult = await Session.aggregate([
      {
        $match: {
          status: "Completed",
          endTime: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    // Today's printer/Xerox revenue
    const serviceRevenueResult = await ServiceUsage.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const sessionRevenue =
      sessionRevenueResult.length > 0
        ? sessionRevenueResult[0].total
        : 0;

    const serviceRevenue =
      serviceRevenueResult.length > 0
        ? serviceRevenueResult[0].total
        : 0;

    const totalRevenue = sessionRevenue + serviceRevenue;

    res.json({
      totalCustomers,
      totalTerminals,
      availableTerminals,
      occupiedTerminals,
      activeSessions,
      today: {
        sessionRevenue,
        serviceRevenue,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};