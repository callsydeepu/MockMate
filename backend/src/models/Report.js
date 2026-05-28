const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    communicationScore: {
      type: Number,
      default: 0,
    },

    technicalScore: {
      type: Number,
      default: 0,
    },

    confidenceScore: {
      type: Number,
      default: 0,
    },

    strengths: [String],

    weaknesses: [String],

    feedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);