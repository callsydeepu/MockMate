import apiClient from './apiClient';

interface AnalyticsResponse {
  totalInterviews: number;
  totalReports: number;
  averageScore: string;
  averageCommunication: string;
  averageTechnical: string;
  averageConfidence: string;
  recentReports: Array<{
    overallScore: number;
    confidenceScore: number;
    technicalScore: number;
    createdAt: string;
  }>;
}

export const analyticsService = {
  getDashboardSummary: async () => {
    const response = await apiClient.get<AnalyticsResponse>('/analytics');

    return {
      interviewsCompleted: response.data.totalInterviews,
      reportsGenerated: response.data.totalReports,
      averageScore: Number(response.data.averageScore),
      readinessRatio: Number(response.data.averageConfidence),
      averageCommunication: Number(response.data.averageCommunication),
      averageTechnical: Number(response.data.averageTechnical),
      fillerWordsAverage: 0,
    };
  },

  getScoreTrends: async () => {
    const response = await apiClient.get<AnalyticsResponse>('/analytics');

    return response.data.recentReports.map((report) => ({
      date: new Date(report.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
      }),
      score: report.overallScore,
      confidence: report.confidenceScore,
      technical: report.technicalScore,
    }));
  },
};
