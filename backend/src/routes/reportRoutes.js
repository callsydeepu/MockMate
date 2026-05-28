const express = require("express");

const protect = require("../middlewares/authMiddleware");

const {
  generateReport,
  getUserReports,
  downloadReportPDF,
} = require("../controllers/reportController");

const router = express.Router();

router.post("/generate", protect, generateReport);

router.get("/", protect, getUserReports);

router.get("/:id/download", protect, downloadReportPDF);

module.exports = router;