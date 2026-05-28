/**
 * Application-wide constants
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.mockmate.ai/v1';
export const API_TIMEOUT = 30000; // 30 seconds

// Authentication
export const AUTH_TOKEN_KEY = 'mockmate_token';
export const AUTH_USER_KEY = 'mockmate_user';
export const AUTH_REMEMBER_KEY = 'mockmate_remember';

// Interview Configuration
export const INTERVIEW_DURATIONS = [15, 30, 45, 60];
export const DEFAULT_INTERVIEW_DURATION = 30;
export const MIN_INTERVIEW_QUESTIONS = 3;
export const MAX_INTERVIEW_QUESTIONS = 10;

// Question Categories
export const QUESTION_CATEGORIES = {
  BEHAVIORAL: 'behavioral',
  TECHNICAL: 'technical',
  SYSTEM_DESIGN: 'system-design',
  GENERAL: 'general',
} as const;

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

// Score Thresholds
export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 80,
  SATISFACTORY: 70,
  NEEDS_IMPROVEMENT: 50,
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// UI Colors
export const THEME_COLORS = {
  PRIMARY: '#7F5AF0',
  SECONDARY: '#6C5CE7',
  ACCENT: '#00BFA6',
  DANGER: '#FF6B6B',
  WARNING: '#FFA500',
  SUCCESS: '#10B981',
};

// Analytics
export const ANALYTICS_EVENTS = {
  INTERVIEW_START: 'interview_start',
  INTERVIEW_COMPLETE: 'interview_complete',
  QUESTION_ANSWERED: 'question_answered',
  USER_LOGIN: 'user_login',
  USER_SIGNUP: 'user_signup',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGINATION_SIZES = [5, 10, 25, 50];

// Feature Flags
export const FEATURES = {
  REAL_TIME_FEEDBACK: true,
  ADVANCED_ANALYTICS: true,
  EXPORT_REPORTS: true,
  COMPANY_COMPARISON: true,
};
