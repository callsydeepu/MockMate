const Report = require("../models/Report");
const Interview = require("../models/Interview");
const PDFDocument = require("pdfkit");
const aiService = require("../services/aiService");
const User = require("../models/User");

const generateReport = async (req, res) => {
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

    // Defensive check: check if report has already been generated
    const existingReport = await Report.findOne({ interview: interviewId });
    if (existingReport) {
      console.log(`[DEBUG] backend report controller - Existing report found for interview: ${interviewId}, returning cached report.`);
      return res.status(200).json({
        message: "Report already generated",
        report: existingReport,
      });
    }

    console.log(`[DEBUG] backend report controller - Triggering AI evaluation service...`);

    // Call dynamic experience-aware Progressive AI evaluation engine
    const evaluation = await aiService.evaluateInterview({
      role: interview.role,
      company: interview.company,
      difficulty: interview.difficulty,
      experienceLevel: interview.experienceLevel,
      questions: interview.questions,
    });

    // Create Report in MongoDB
    const report = await Report.create({
      user: interview.user,
      interview: interview._id,
      overallScore: evaluation.overallScore,
      communicationScore: evaluation.communicationScore,
      technicalScore: evaluation.technicalScore,
      confidenceScore: evaluation.confidenceScore,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      feedback: evaluation.feedback,
      questionBreakdown: evaluation.questionBreakdown || [],
    });

    console.log(`[DEBUG] backend report controller - Report created successfully in MongoDB under ID: ${report._id}`);

    // Update User cumulative dashboard analytics metrics
    const user = await User.findById(interview.user);
    if (user) {
      const userReports = await Report.find({ user: user._id });
      const totalReports = userReports.length;
      const totalScore = userReports.reduce((acc, curr) => acc + curr.overallScore, 0);
      
      user.interviewsTaken = totalReports;
      user.averageScore = Math.round(totalScore / totalReports);
      await user.save();
      console.log(`[DEBUG] backend report controller - Cumulative analytics updated for user: ${user._id} (Interviews: ${user.interviewsTaken}, Avg Score: ${user.averageScore})`);
    }

    res.status(201).json({
      message: "Report generated",
      report,
    });
  } catch (error) {
    console.error(`[DEBUG] backend report controller - Exception:`, error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({
      user: req.user._id,
    })
      .populate("interview")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const downloadReportPDF = async (req, res) => {
  try {
    const reportId = req.params.id;
    console.log("PDF request:", req.params.id);
    console.log(`[DEBUG] backend PDF generation - Fetching report ID: ${reportId}`);

    const report = await Report.findById(reportId)
      .populate("user")
      .populate("interview");

    if (!report) {
      console.error(`[DEBUG] backend PDF generation - Report not found for ID: ${reportId}`);
      return res.status(404).json({
        message: "Report not found",
      });
    }

    // Ownership check to prevent IDOR
    if (report.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden: Access denied",
      });
    }

    console.log(`[DEBUG] backend PDF generation - Found report, starting PDF generation`);

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers to trigger download in browser
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report-${report._id}.pdf`
    );

    // Pipe the PDF directly to the express response object
    doc.pipe(res);

    // Title / Header
    doc
      .fillColor("#6d28d9") // premium purple
      .fontSize(26)
      .text("MockMate X AI - Interview Report", { align: "center" })
      .moveDown(1);

    // Horizontal separator
    doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1.5);

    // Details Block (User, Company, Role, Date)
    doc.fillColor("#0f172a").fontSize(14).text("Interview Details", { underline: true }).moveDown(0.5);

    doc.fontSize(11).fillColor("#334155");
    doc.text(`Candidate: ${report.user ? report.user.name : "N/A"}`);
    doc.text(`Email: ${report.user ? report.user.email : "N/A"}`);
    doc.text(`Target Company: ${report.interview ? report.interview.company : "General"}`);
    doc.text(`Target Role: ${report.interview ? report.interview.role : "Software Engineer"}`);
    doc.text(`Completed On: ${new Date(report.createdAt).toLocaleDateString()}`);
    doc.moveDown(1.5);

    // Horizontal separator
    doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1.5);

    // Scores Block
    doc.fillColor("#0f172a").fontSize(14).text("Performance Metrics", { underline: true }).moveDown(0.5);

    doc.fontSize(12).fillColor("#1e293b");
    doc.text(`Overall Score: ${report.overallScore}%`);
    doc.text(`Confidence Score: ${report.confidenceScore}%`);
    doc.text(`Communication Score: ${report.communicationScore}%`);
    doc.text(`Technical Score: ${report.technicalScore}%`);
    doc.moveDown(1.5);

    // Horizontal separator
    doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1.5);

    // Strengths, Weaknesses, Feedback
    doc.fillColor("#0f172a").fontSize(14).text("AI Feedback & Insights", { underline: true }).moveDown(0.5);

    doc.fontSize(11).fillColor("#1e293b").text("Key Strengths:", { bold: true });
    doc.fillColor("#334155");
    if (report.strengths && report.strengths.length > 0) {
      report.strengths.forEach((s) => doc.text(`• ${s}`));
    } else {
      doc.text("• No key strengths specified.");
    }
    doc.moveDown(0.5);

    doc.fillColor("#1e293b").text("Areas for Improvement:", { bold: true });
    doc.fillColor("#334155");
    if (report.weaknesses && report.weaknesses.length > 0) {
      report.weaknesses.forEach((w) => doc.text(`• ${w}`));
    } else {
      doc.text("• No specific weaknesses specified.");
    }
    doc.moveDown(0.5);

    doc.fillColor("#1e293b").text("Overall Recommendations:", { bold: true });
    doc.fillColor("#334155").text(report.feedback || "Keep practicing using our Mock Space!");
    doc.moveDown(1.5);

    // Horizontal separator
    doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1.5);

    // Question Breakdown
    if (report.questionBreakdown && report.questionBreakdown.length > 0) {
      doc.fillColor("#0f172a").fontSize(14).text("Question & Answer Breakdown", { underline: true }).moveDown(0.5);
      
      report.questionBreakdown.forEach((q, idx) => {
        // Keep question titles together with question block
        if (doc.y > 600) {
          doc.addPage();
        }
        
        doc.fontSize(11).fillColor("#0f172a").text(`Question ${idx + 1}: ${q.question}`, { bold: true }).moveDown(0.3);
        doc.fontSize(10).fillColor("#475569").text(`Your Response: "${q.userAnswer || "[No response provided]"}"`, { italic: true }).moveDown(0.3);
        
        doc.fontSize(10).fillColor("#4f46e5").text(`Score: ${q.score}%`, { bold: true }).moveDown(0.3);
        doc.fontSize(9.5).fillColor("#1e293b").text(`AI Critique: ${q.feedback}`).moveDown(0.3);
        
        if (q.expectedAnswer) {
          doc.fontSize(9.5).fillColor("#047857").text(`Expected / Ideal Answer: "${q.expectedAnswer}"`, { bold: true }).moveDown(0.8);
        } else {
          doc.moveDown(0.8);
        }
      });
    } else if (report.interview && report.interview.questions && report.interview.questions.length > 0) {
      doc.fillColor("#0f172a").fontSize(14).text("Question & Answer Breakdown", { underline: true }).moveDown(0.5);
      
      report.interview.questions.forEach((q, idx) => {
        if (doc.y > 650) {
          doc.addPage();
        }
        
        doc.fontSize(11).fillColor("#0f172a").text(`Question ${idx + 1}: ${q.question}`, { bold: true }).moveDown(0.3);
        doc.fontSize(10).fillColor("#475569").text(`Answer: "${q.answer || "[No response provided]"}"`, { italic: true }).moveDown(0.8);
      });
    }

    // doc.end() closes the stream and triggers sending the response
    doc.end();

    console.log(`[DEBUG] backend PDF generation - Successfully completed writing stream to client`);
  } catch (error) {
    console.error(`[DEBUG] backend PDF generation - Error occurred:`, error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  generateReport,
  getUserReports,
  downloadReportPDF,
};