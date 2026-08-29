const express = require("express");
const router = express.Router();

const Session = require("../models/Session");
const Customer = require("../models/Customer");
const Terminal = require("../models/Terminal");

// Get all sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("customer")
      .populate("terminal")
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({
      message: "Failed to fetch sessions",
      error: error.message,
    });
  }
});

// Start a new session
router.post("/", async (req, res) => {
  try {
    const { customer, terminal } = req.body;

    if (!customer || !terminal) {
      return res.status(400).json({
        message: "Customer and terminal are required",
      });
    }

    const customerExists = await Customer.findById(customer);

    if (!customerExists) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const terminalExists = await Terminal.findById(terminal);

    if (!terminalExists) {
      return res.status(404).json({
        message: "Terminal not found",
      });
    }

    // Check if terminal is already being used
    const existingSession = await Session.findOne({
      terminal,
      status: "Active",
    });

    if (existingSession) {
      return res.status(400).json({
        message: "This terminal is already occupied",
      });
    }

    // Create session
    const session = await Session.create({
      customer,
      terminal,
      startTime: new Date(),
      status: "Active",
      durationMinutes: 0,
      amount: 0,
    });

    // Mark terminal occupied
    terminalExists.status = "Occupied";
    await terminalExists.save();

    const populatedSession = await Session.findById(session._id)
      .populate("customer")
      .populate("terminal");

    res.status(201).json(populatedSession);
  } catch (error) {
    console.error("Start session error:", error);

    res.status(500).json({
      message: "Failed to start session",
      error: error.message,
    });
  }
});

// Stop a session and calculate bill
router.put("/:id/stop", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    if (session.status === "Completed") {
      return res.status(400).json({
        message: "Session is already completed",
      });
    }

    const endTime = new Date();

    // Calculate duration in minutes
    const durationMilliseconds =
      endTime.getTime() - session.startTime.getTime();

    const durationMinutes = Math.max(
      1,
      Math.ceil(durationMilliseconds / (1000 * 60))
    );

    /*
      Default browsing rate:
      ₹20 per hour

      Billing is calculated per minute.
    */
    const RATE_PER_HOUR = 20;

    const amount = Number(
      ((durationMinutes / 60) * RATE_PER_HOUR).toFixed(2)
    );

    session.endTime = endTime;
    session.durationMinutes = durationMinutes;
    session.amount = amount;
    session.status = "Completed";

    await session.save();

    // Make terminal available again
    const terminal = await Terminal.findById(session.terminal);

    if (terminal) {
      terminal.status = "Available";
      await terminal.save();
    }

    const populatedSession = await Session.findById(session._id)
      .populate("customer")
      .populate("terminal");

    res.json(populatedSession);
  } catch (error) {
    console.error("Stop session error:", error);

    res.status(500).json({
      message: "Failed to stop session",
      error: error.message,
    });
  }
});

module.exports = router;