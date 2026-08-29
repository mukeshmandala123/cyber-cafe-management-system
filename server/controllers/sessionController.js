const Session = require("../models/Session");
const Customer = require("../models/Customer");
const Terminal = require("../models/Terminal");

// Get all sessions
const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("customer")
      .populate("terminal")
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one session
const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("customer")
      .populate("terminal");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Start a session
const startSession = async (req, res) => {
  try {
    const { customer, terminal } = req.body;

    // Check customer
    const existingCustomer = await Customer.findById(customer);

    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Check terminal
    const existingTerminal = await Terminal.findById(terminal);

    if (!existingTerminal) {
      return res.status(404).json({ message: "Terminal not found" });
    }

    // Make sure terminal is available
    if (existingTerminal.status !== "Available") {
      return res.status(400).json({
        message: "Terminal is not available",
      });
    }

    // Create session
    const session = await Session.create({
      customer,
      terminal,
      startTime: new Date(),
      status: "Active",
    });

    // Mark terminal as occupied
    existingTerminal.status = "Occupied";
    await existingTerminal.save();

    const populatedSession = await Session.findById(session._id)
      .populate("customer")
      .populate("terminal");

    res.status(201).json(populatedSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// End a session
const endSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status === "Completed") {
      return res.status(400).json({
        message: "Session is already completed",
      });
    }

    const terminal = await Terminal.findById(session.terminal);

    if (!terminal) {
      return res.status(404).json({ message: "Terminal not found" });
    }

    // Calculate end time
    const endTime = new Date();

    // Calculate duration in minutes
    const durationMilliseconds =
      endTime.getTime() - session.startTime.getTime();

    const durationMinutes = Math.ceil(durationMilliseconds / (1000 * 60));

    // Calculate amount
    const amount = (durationMinutes / 60) * terminal.ratePerHour;

    // Update session
    session.endTime = endTime;
    session.durationMinutes = durationMinutes;
    session.amount = Number(amount.toFixed(2));
    session.status = "Completed";

    await session.save();

    // Make terminal available again
    terminal.status = "Available";
    await terminal.save();

    const populatedSession = await Session.findById(session._id)
      .populate("customer")
      .populate("terminal");

    res.json(populatedSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getSessions,
  getSession,
  startSession,
  endSession,
};