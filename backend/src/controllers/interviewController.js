const Interview = require("../models/Interview");
const aiService = require("../services/aiService");

const startInterview = async (req, res) => {
  try {
    const { role, company, difficulty, experienceLevel } = req.body;

    // Resolve experienceLevel dynamically based on difficulty if not explicitly passed by client
    const resolvedExperience = experienceLevel || (
      difficulty === "easy" ? "junior" :
      difficulty === "hard" ? "senior" : "mid-level"
    );

    const interview = await Interview.create({
      user: req.user._id,
      role,
      company,
      difficulty,
      experienceLevel: resolvedExperience,
      questions: [],
    });

    res.status(201).json({
      message: "Interview started",
      interview,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addQuestion = async (req, res) => {
  try {
    const { interviewId, question } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    // Ownership check to prevent IDOR
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden: Access denied",
      });
    }

    interview.questions.push({
      question,
      category: "technical",
      difficulty: interview.difficulty === "easy" ? "simple" : interview.difficulty === "hard" ? "advanced" : "moderate"
    });

    await interview.save();

    res.status(200).json({
      message: "Question added",
      interview,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    // Ownership check to prevent IDOR
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden: Access denied",
      });
    }

    // Boundary check on questionIndex to prevent process crash
    if (questionIndex === undefined || questionIndex === null || questionIndex < 0 || questionIndex >= interview.questions.length) {
      return res.status(400).json({
        message: "Invalid question index mapping",
      });
    }

    interview.questions[questionIndex].answer = answer;

    await interview.save();

    res.status(200).json({
      message: "Answer submitted",
      interview,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const endInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    // Ownership check to prevent IDOR
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden: Access denied",
      });
    }

    interview.status = "completed";

    await interview.save();

    res.status(200).json({
      message: "Interview completed",
      interview,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    // Ownership check to prevent IDOR
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden: Access denied",
      });
    }

    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const generateQuestion = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    // Ownership check to prevent IDOR
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden: Access denied",
      });
    }

    const { role, company, difficulty, experienceLevel, questions } = interview;
    const previousQuestions = questions.map(q => q.question).slice(-3); // Only pass last 3 questions to save token size & speed up latency
    const questionIndex = questions.length;

    // Call dynamic role-specific progressive AI generator service
    const generatedQuestion = await aiService.generateRoleSpecificQuestion({
      role,
      company,
      difficulty,
      experienceLevel: experienceLevel || "junior",
      previousQuestions,
      questionIndex
    });

    // Save generated question text & metadata to MongoDB
    interview.questions.push({
      question: generatedQuestion.text,
      category: generatedQuestion.category,
      difficulty: generatedQuestion.difficulty,
    });
    await interview.save();

    console.log(`[DEBUG] backend AI controller - Question saved successfully to MongoDB & returned: "${generatedQuestion.text}"`);

    res.status(200).json({
      message: "Question generated",
      question: generatedQuestion,
    });
  } catch (error) {
    console.error(`[DEBUG] backend AI controller - Error encountered:`, error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  startInterview,
  addQuestion,
  submitAnswer,
  endInterview,
  getInterview,
  generateQuestion,
};

