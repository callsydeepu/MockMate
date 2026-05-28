const Report = require("../models/Report");
const Interview = require("../models/Interview");
const PDFDocument = require("pdfkit");

const generateReport = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    // temporary dummy scores
    const report = await Report.create({
      user: interview.user,
      interview: interview._id,

      overallScore: 78,
      communicationScore: 80,
      technicalScore: 75,
      confidenceScore: 77,

      strengths: [
        "Good communication",
        "Confident answers",
      ],

      weaknesses: [
        "Need deeper technical explanations",
      ],

      feedback:
        "Overall performance was good. Improve technical depth.",
    });

    res.status(201).json({
      message: "Report generated",
      report,
    });
  } catch (error) {
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

    console.log(`[DEBUG] backend PDF generation - Found report, starting PDF generation`);

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers to trigger download in browser
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=mockmate-report-${reportId}.pdf`
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
    if (report.interview && report.interview.questions && report.interview.questions.length > 0) {
      doc.fillColor("#0f172a").fontSize(14).text("Question & Answer Breakdown", { underline: true }).moveDown(0.5);
      
      report.interview.questions.forEach((q, idx) => {
        // Keep question titles together with question block
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