const Terminal = require("../models/Terminal");

// Get all terminals
const getTerminals = async (req, res) => {
  try {
    const terminals = await Terminal.find().sort({ terminalNumber: 1 });
    res.json(terminals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one terminal
const getTerminal = async (req, res) => {
  try {
    const terminal = await Terminal.findById(req.params.id);

    if (!terminal) {
      return res.status(404).json({ message: "Terminal not found" });
    }

    res.json(terminal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create terminal
const createTerminal = async (req, res) => {
  try {
    const { terminalNumber, type, status, ratePerHour } = req.body;

    const terminal = await Terminal.create({
      terminalNumber,
      type,
      status,
      ratePerHour,
    });

    res.status(201).json(terminal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update terminal
const updateTerminal = async (req, res) => {
  try {
    const terminal = await Terminal.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!terminal) {
      return res.status(404).json({ message: "Terminal not found" });
    }

    res.json(terminal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete terminal
const deleteTerminal = async (req, res) => {
  try {
    const terminal = await Terminal.findByIdAndDelete(req.params.id);

    if (!terminal) {
      return res.status(404).json({ message: "Terminal not found" });
    }

    res.json({ message: "Terminal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTerminals,
  getTerminal,
  createTerminal,
  updateTerminal,
  deleteTerminal,
};