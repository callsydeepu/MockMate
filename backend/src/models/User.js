const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: false,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },

    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },

    avatar: {
      type: String,
      default: "",
    },

    interviewsTaken: {
      type: Number,
      default: 0,
    },

    averageScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);