import apiClient from './apiClient';

interface BackendInterview {
  _id: string;
  role: string;
  company: string;
  questions?: Array<{
    question: string;
    answer: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
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
  updatedAt: string;
}

export interface ReportViewModel {
  id: string;
  interviewId?: string;
  companyName: string;
  role: string;
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  createdAt: string;
  updatedAt: string;
  dateLabel: string;
  performanceLevel: string;
  transcriptSummary: Array<{
    question: string;
    answer: string;
    feedback: string;
    score: number;
  }>;
}

const resolvePerformanceLevel = (score: number): string => {
  if (score >= 90) return 'Advanced';
  if (score >= 75) return 'Skilled';
  if (score >= 60) return 'Developing';
  return 'Beginner';
};

const formatDateLabel = (isoDate: string): string => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return 'Unknown date';
  }

  return parsed.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const mapBackendReportToViewModel = (report: BackendReport): ReportViewModel => {
  const reportDate = report.createdAt || report.interview?.createdAt || '';

  return {
    id: report._id,
    interviewId: report.interview?._id,
    companyName: report.interview?.company || 'General',
    role: report.interview?.role || 'Software Engineer',
    overallScore: report.overallScore ?? 0,
    communicationScore: report.communicationScore ?? 0,
    technicalScore: report.technicalScore ?? 0,
    confidenceScore: report.confidenceScore ?? 0,
    strengths: report.strengths ?? [],
    weaknesses: report.weaknesses ?? [],
    feedback: report.feedback ?? 'No feedback available yet.',
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    dateLabel: formatDateLabel(reportDate),
    performanceLevel: resolvePerformanceLevel(report.overallScore ?? 0),
    transcriptSummary:
      report.interview?.questions?.map((item, index) => ({
        question: item.question,
        answer: item.answer || '[No answer provided]',
        feedback: report.feedback || 'Review your answer and improve depth and structure.',
        score: Math.max((report.overallScore ?? 0) - index * 2, 0),
      })) ?? [],
  };
};

export const reportService = {
  getReports: async (): Promise<ReportViewModel[]> => {
    const response = await apiClient.get<BackendReport[]>('/reports');
    return response.data.map(mapBackendReportToViewModel);
  },
};
