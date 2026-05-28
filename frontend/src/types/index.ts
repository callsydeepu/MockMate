/**
 * Common TypeScript interfaces and types for MockMate X AI
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  headline?: string;
  joinedDate: string;
}

export interface InterviewSession {
  id: string;
  companyName: string;
  role: string;
  duration: number;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  isPaused: boolean;
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  transcript: string;
  recordingUrl?: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'behavioral' | 'technical' | 'system-design' | 'general';
  question: string;
  company?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedDuration: number;
}

export interface InterviewReport {
  id: string;
  sessionId: string;
  companyName: string;
  role: string;
  date: string;
  duration: number;
  overallScore: number;
  confidenceScore: number;
  communicationScore: number;
  technicalScore: number;
  eyeContactRatio: number;
  fillerWordsCount: number;
  wpm: number;
  strengths: string[];
  improvements: string[];
  feedback: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  read: boolean;
  time: string;
  action?: {
    label: string;
    url: string;
  };
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionsCount: number;
}

export interface AnalyticsData {
  date: string;
  Overall: number;
  Technical: number;
  Behavioral: number;
  Communication: number;
}

export interface ScoreVector {
  subject: string;
  A: number;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type CardVariant = 'glass' | 'elevated' | 'flat' | 'outline';
export type CardSize = 'sm' | 'md' | 'lg';
export type GlowColor = 'purple' | 'cyan' | 'emerald' | 'pink' | 'blue' | 'none';
