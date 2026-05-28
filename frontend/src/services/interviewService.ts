import apiClient from './apiClient';
import type { Question, InterviewReport } from '../context/interview/InterviewContext';

interface BackendInterview {
  _id: string;
  role: string;
  company: string;
  questions: Array<{ question: string; answer: string }>;
  createdAt: string;
}

interface BackendReport {
  _id: string;
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  interview?: BackendInterview;
  createdAt: string;
}

const mapBackendReportToInterviewReport = (report: BackendReport): InterviewReport => {
  const interview = report.interview;

  const performanceLevel =
    report.overallScore >= 90
      ? 'Advanced'
      : report.overallScore >= 75
      ? 'Skilled'
      : report.overallScore >= 60
      ? 'Developing'
      : 'Beginner';

  return {
    id: report._id,
    companyName: interview?.company || 'General',
    role: interview?.role || 'Software Engineer',
    date: new Date(report.createdAt).toISOString().split('T')[0],
    overallScore: report.overallScore,
    confidenceScore: report.confidenceScore,
    communicationScore: report.communicationScore,
    technicalScore: report.technicalScore,
    fillerWordCount: 0,
    eyeContactRatio: 0,
    performanceLevel,
    performanceTags: [...(report.strengths || []), ...(report.weaknesses || [])],
    transcriptSummary:
      interview?.questions?.map((question, index) => ({
        question: question.question,
        answer: question.answer || '[No answer provided] ',
        feedback: report.feedback,
        score:
          index === 0
            ? report.overallScore
            : Math.max(0, report.overallScore - index * 2),
      })) || [],
    suggestions: [report.feedback, ...(report.weaknesses || [])].filter(Boolean),
  };
};

export const interviewService = {
  getQuestions: async (_company: string): Promise<Question[]> => {
    return [];
  },

  startInterview: async (payload: {
    role: string;
    company: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  }) => {
    const res = await apiClient.post('/interview/start', payload);
    return res.data;
  },

  addQuestion: async (interviewId: string, question: string) => {
    const res = await apiClient.post('/interview/add-question', {
      interviewId,
      question,
    });
    return res.data;
  },

  submitAnswer: async (interviewId: string, questionIndex: number, answer: string) => {
    const res = await apiClient.post('/interview/submit-answer', {
      interviewId,
      questionIndex,
      answer,
    });
    return res.data;
  },

  endInterview: async (interviewId: string) => {
    const res = await apiClient.put('/interview/end', { interviewId });
    return res.data;
  },

  generateReport: async (interviewId: string) => {
    const res = await apiClient.post('/reports/generate', { interviewId });
    return res.data;
  },

  getUserReports: async (): Promise<InterviewReport[]> => {
    const res = await apiClient.get<BackendReport[]>('/reports');
    return res.data.map(mapBackendReportToInterviewReport);
  },

  downloadReportPDF: async (reportId: string): Promise<boolean> => {
    console.log(`[DEBUG] API request - Downloading PDF for report ID: ${reportId}`);
    try {
      const response = await apiClient.get(`/reports/${reportId}/download`, {
        responseType: 'blob',
      });

      console.log(`[DEBUG] API response - Status: ${response.status}`);

      // Handle the blob response and trigger automatic browser download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `mockmate-report-${reportId}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      console.log('[DEBUG] download success - Browser download triggered');
      return true;
    } catch (error) {
      console.error('[DEBUG] download failure - Axios error during download:', error);
      throw error;
    }
  },

  generateNextQuestion: async (interviewId: string): Promise<Question> => {
    console.log(`[DEBUG] API request - Generating dynamic follow-up question for interview: ${interviewId}`);
    const res = await apiClient.post<{ message: string; question: Question }>('/interview/generate-question', { interviewId });
    console.log('[DEBUG] API response - Generated question successfully:', res.data.question);
    return res.data.question;
  },
};
