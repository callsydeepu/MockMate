const Report = require("../models/Report");

const getAnalytics = async (req, res) => {
  try {
    const reports = await Report.find({
      user: req.user._id,
    });

    const totalInterviews = reports.length;

    let averageScore = 0;
    let averageCommunication = 0;
    let averageTechnical = 0;
    let averageConfidence = 0;

    if (reports.length > 0) {
      averageScore =
        reports.reduce(
          (acc, report) => acc + report.overallScore,
          0
        ) / reports.length;

      averageCommunication =
        reports.reduce(
          (acc, report) =>
            acc + report.communicationScore,
          0
        ) / reports.length;

      averageTechnical =
        reports.reduce(
          (acc, report) =>
            acc + report.technicalScore,
          0
        ) / reports.length;

      averageConfidence =
        reports.reduce(
          (acc, report) =>
            acc + report.confidenceScore,
          0
        ) / reports.length;
    }

    res.status(200).json({
      totalInterviews,

      averageScore: averageScore.toFixed(1),

      averageCommunication:
        averageCommunication.toFixed(1),

      averageTechnical:
        averageTechnical.toFixed(1),

      averageConfidence:
        averageConfidence.toFixed(1),

      recentReports: reports.slice(-5),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAnalytics,
};