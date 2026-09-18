const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: [
        "Black & White Printing",
        "Colour Printing",
        "Xerox",
      ],
      required: true,
    },

    type: {
      type: String,
      enum: [
        "Printing",
        "Xerox",
      ],
      required: true,
    },

    ratePerPage: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "Available",
        "Unavailable",
        "Maintenance",
      ],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);
