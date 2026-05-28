const express = require("express");
const protect = require("../middlewares/authMiddleware");

const {
  startInterview,
  addQuestion,
  submitAnswer,
  getInterview,
  endInterview,
  generateQuestion
} = require("../controllers/interviewController");

const router = express.Router();

router.post("/start", protect, startInterview);
router.post("/add-question", protect, addQuestion);
router.post("/submit-answer", protect, submitAnswer);
router.post("/generate-question", protect, generateQuestion);
router.put("/end", protect, endInterview);
router.get("/:id", protect, getInterview);

module.exports = router;