const express = require("express");

const protect = require("../middlewares/authMiddleware");

const {
  getAnalytics,
} = require("../controllers/analyticsController");

const router = express.Router();

router.get("/", protect, getAnalytics);

module.exports = router;