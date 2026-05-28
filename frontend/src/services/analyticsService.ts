import apiClient from './apiClient';

interface AnalyticsResponse {
  totalInterviews: number;
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
      averageScore: Number(response.data.averageScore),
      readinessRatio: Number(response.data.averageConfidence),
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
