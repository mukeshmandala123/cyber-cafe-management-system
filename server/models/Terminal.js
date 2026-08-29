const mongoose = require("mongoose");

const terminalSchema = new mongoose.Schema(
  {
    terminalNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    type: {
      type: String,
      enum: ["Browsing", "Gaming", "Academics"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance"],
      default: "Available",
    },

    ratePerHour: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Terminal", terminalSchema);