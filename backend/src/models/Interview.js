const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    experienceLevel: {
      type: String,
      enum: ["junior", "mid-level", "senior"],
      default: "junior",
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          default: "",
        },
        category: {
          type: String,
          enum: ["fundamentals", "projects", "debugging", "behavioral", "technical", "system-design"],
          default: "technical",
        },
        difficulty: {
          type: String,
          enum: ["simple", "moderate", "advanced", "easy", "medium", "hard"],
          default: "moderate",
        },
      },
    ],

    status: {
      type: String,
      enum: ["started", "completed"],
      default: "started",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);