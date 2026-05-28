import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { interviewService } from '../../services/interviewService';

export interface Question {
  id: string;
  text: string;
  category: 'behavioral' | 'technical' | 'system-design';
  difficulty: 'simple' | 'moderate' | 'advanced';
  suggestedDuration: number; // in seconds
  tips: string[];
}

export interface InterviewSession {
  id: string;
  backendInterviewId?: string;
  companyName: string;
  role: string;
  durationMinutes: number;
  questions: Question[];
  currentQuestionIndex: number;
  isActive: boolean;
  isPaused: boolean;
  timeRemaining: number; // overall or per question
  elapsedTime: number;
  cameraEnabled: boolean;
  micEnabled: boolean;
  transcripts: { [questionId: string]: string };
  confidenceHistory: number[]; // mock real-time tracking values
  eyeContactHistory: number[]; // mock tracking values
}

export interface InterviewReport {
  id: string;
  companyName: string;
  role: string;
  date: string;
  overallScore: number;
  confidenceScore: number;
  communicationScore: number;
  technicalScore: number;
  fillerWordCount: number;
  eyeContactRatio: number; // percentage
  performanceLevel: string;
  performanceTags: string[];
  transcriptSummary: { question: string; answer: string; feedback: string; score: number }[];
  suggestions: string[];
}

interface InterviewContextType {
  activeSession: InterviewSession | null;
  reports: InterviewReport[];
  isSubmittingSession: boolean;
  isGeneratingNext: boolean;
  startInterview: (company: string, role: string, durationMinutes: number, customQuestions?: Question[]) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  generateNextQuestion: () => Promise<void>;
  pauseInterview: () => void;
  resumeInterview: () => void;
  toggleCamera: () => void;
  toggleMic: () => void;
  appendTranscript: (text: string) => void;
  endInterview: () => Promise<InterviewReport>;
  clearSession: () => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

const MOCK_QUESTIONS: { [key: string]: Question[] } = {
  Google: [
    {
      id: 'g_q1',
      text: 'Tell me about a time you had to deal with a conflict in a project team. How did you resolve it?',
      category: 'behavioral',
      difficulty: 'simple',
      suggestedDuration: 120,
      tips: ['Use the STAR method (Situation, Task, Action, Result).', 'Focus on your actions and what you learned.', 'Keep the tone professional and constructive.'],
    },
    {
      id: 'g_q2',
      text: 'Given an array of integers, how would you find the longest contiguous subarray with an equal number of 0s and 1s? What is the time complexity?',
      category: 'technical',
      difficulty: 'moderate',
      suggestedDuration: 180,
      tips: ['Think about representing 0s as -1s.', 'Use a Hash Map to store cumulative sums and their first occurrence index.', 'Expected time complexity should be O(N).'],
    },
    {
      id: 'g_q3',
      text: 'How would you design a scalable service like Google Auto-complete that handles millions of queries per second?',
      category: 'system-design',
      difficulty: 'advanced',
      suggestedDuration: 240,
      tips: ['Consider data structures like Tries to store prefix suggestions.', 'Discuss caching strategies (Redis) at the edge.', 'Explain how to handle write-heavy analytics data for search trends.'],
    },
  ],
  Amazon: [
    {
      id: 'a_q1',
      text: 'Can you describe a situation where you had to make a decision without having all the data you needed? Which Leadership Principle did you draw upon?',
      category: 'behavioral',
      difficulty: 'simple',
      suggestedDuration: 120,
      tips: ['This relates to "Bias for Action" and "Are Right, A Lot".', 'Explain how you mitigated risks.', 'Quantify the outcome where possible.'],
    },
    {
      id: 'a_q2',
      text: 'How would you find the first non-repeating character in a string? Talk through your design and spatial constraints.',
      category: 'technical',
      difficulty: 'moderate',
      suggestedDuration: 120,
      tips: ['A frequency hash map or a fixed 256-element integer array is suitable.', 'Talk about double pass vs. single pass using a queue.', 'Explain spatial trade-offs.'],
    },
    {
      id: 'a_q3',
      text: 'Explain how you would design a highly available order management service supporting millions of daily transactions.',
      category: 'system-design',
      difficulty: 'advanced',
      suggestedDuration: 220,
      tips: ['Discuss architecture for availability and consistency.', 'Mention load balancing, caching, and eventual consistency.', 'Describe how you would scale the service across regions.'],
    },
  ],
  Microsoft: [
    {
      id: 'm_q1',
      text: 'What makes a resilient cloud architecture, and how would you design one for a global application?',
      category: 'system-design',
      difficulty: 'advanced',
      suggestedDuration: 210,
      tips: ['Talk about redundancy, failover, and region isolation.', 'Mention monitoring and automated recovery.', 'Explain how to balance cost with resilience.'],
    },
    {
      id: 'm_q2',
      text: 'Describe a time you improved a cross-team workflow or delivery pipeline.',
      category: 'behavioral',
      difficulty: 'moderate',
      suggestedDuration: 140,
      tips: ['Share the problem, your actions, and the value delivered.', 'Focus on collaboration and iteration.', 'Keep the example clear and outcome-driven.'],
    },
  ],
  General: [
    {
      id: 'gen_q1',
      text: 'Why do you want to join MockMate X AI, and what makes you a good fit for this role?',
      category: 'behavioral',
      difficulty: 'simple',
      suggestedDuration: 90,
      tips: ['Align your core values with our product of helping people practice.', 'Show passion for AI/ML coaching tools.', 'Be enthusiastic and succinct.'],
    },
    {
      id: 'gen_q2',
      text: 'How do you approach debugging a difficult production issue?',
      category: 'technical',
      difficulty: 'moderate',
      suggestedDuration: 120,
      tips: ['Describe your troubleshooting process clearly.', 'Mention logs, monitoring, and hypothesis testing.', 'Include the final fix and lessons learned.'],
    },
  ],
};

const sortQuestionsByDifficulty = (company: string): Question[] => {
  const bank = MOCK_QUESTIONS[company] || MOCK_QUESTIONS['General'];
  const difficultyRank: Record<Question['difficulty'], number> = {
    simple: 1,
    moderate: 2,
    advanced: 3,
  };

  return [...bank].sort((a, b) => difficultyRank[a.difficulty] - difficultyRank[b.difficulty]);
};

const INITIAL_REPORTS: InterviewReport[] = [
  {
    id: 'rep_1',
    companyName: 'Google',
    role: 'Software Engineer Intern',
    date: '2026-05-18',
    overallScore: 84,
    confidenceScore: 88,
    communicationScore: 81,
    technicalScore: 83,
    fillerWordCount: 8,
    eyeContactRatio: 92,
    performanceLevel: 'Skilled',
    performanceTags: ['Strong confidence', 'Good communication', 'Ready for higher rounds'],
    transcriptSummary: [
      {
        question: 'Describe a challenging technical problem you solved.',
        answer: 'During my summer project, I encountered a major memory leak in our React dashboard which was lagging client browsers. I profile-tested it using Chrome DevTools and found nested event listeners that were not being cleared on unmount. I replaced them with ref cleanups and reduced memory usage by 40%.',
        feedback: 'Excellent breakdown using Chrome DevTools. Strong description of the technical root cause and concrete impact.',
        score: 87,
      },
    ],
    suggestions: [
      'Speak slightly slower; your pacing was 155 words per minute, which is slightly rushed.',
      'Reduce the usage of filler words like "like" and "basically" (counted 5 times).',
      'Excellent technical articulation and structured logical debugging flow.',
    ],
  },
  {
    id: 'rep_2',
    companyName: 'Amazon',
    role: 'Frontend Engineer',
    date: '2026-05-10',
    overallScore: 78,
    confidenceScore: 72,
    communicationScore: 85,
    technicalScore: 77,
    fillerWordCount: 14,
    eyeContactRatio: 76,
    performanceLevel: 'Developing',
    performanceTags: ['Build confidence', 'Improve coding accuracy'],
    transcriptSummary: [
      {
        question: 'Tell me about a time you disagreed with a manager.',
        answer: 'Uh, my manager wanted to use a custom form validator instead of react-hook-form. I argued that, basically, building from scratch takes longer and has edge-case bugs. We ultimately used the library but wrote custom adapters, which saved 2 days of work.',
        feedback: 'Good instance of showing leadership, but use of filler words (uh, basically) reduced overall clarity. Try structuring with STAR framework.',
        score: 78,
      },
    ],
    suggestions: [
      'Increase your gaze time on the camera to build better trust and apparent eye-contact metrics.',
      'Practice deep breathing to lower slight nervous movements (detected via camera).',
    ],
  },
];

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(() => {
    console.log('[DEBUG] restore flow - checking active session at initialization');
    const savedId = localStorage.getItem('mockmate_active_interview_id');
    const savedSession = localStorage.getItem('mockmate_active_interview_session');
    
    if (savedId && savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        // Ensure no undefined/null values or mismatched ID
        if (parsed && typeof parsed === 'object' && parsed.backendInterviewId === savedId) {
          console.log('[DEBUG] restore flow - successfully restored active session:', parsed);
          return parsed;
        } else {
          console.warn('[DEBUG] restore flow - found saved session but backend ID does not match active ID or is missing', { savedId, parsed });
        }
      } catch (e) {
        console.error('[DEBUG] restore flow - failed to parse saved session:', e);
      }
    } else {
      console.log('[DEBUG] restore flow - no active session found to restore', { savedId, hasSavedSession: !!savedSession });
    }
    return null;
  });

  const normalizeReport = (report: any): InterviewReport => ({
    id: report.id,
    companyName: report.companyName,
    role: report.role,
    date: report.date,
    overallScore: report.overallScore ?? 0,
    confidenceScore: report.confidenceScore ?? 0,
    communicationScore: report.communicationScore ?? 0,
    technicalScore: report.technicalScore ?? 0,
    fillerWordCount: report.fillerWordCount ?? 0,
    eyeContactRatio: report.eyeContactRatio ?? 0,
    performanceLevel: report.performanceLevel ?? 'Beginner',
    performanceTags: report.performanceTags ?? [],
    transcriptSummary: report.transcriptSummary ?? [],
    suggestions: report.suggestions ?? [],
  });

  const [reports, setReports] = useState<InterviewReport[]>(() => {
    const saved = localStorage.getItem('mockmate_reports');
    if (!saved) return INITIAL_REPORTS;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeReport);
      }
    } catch {
      // ignore invalid saved report data
    }
    return INITIAL_REPORTS;
  });
  const [isSubmittingSession, setIsSubmittingSession] = useState<boolean>(false);
  const [isGeneratingNext, setIsGeneratingNext] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const token =
      localStorage.getItem('mockmate_token') ||
      sessionStorage.getItem('mockmate_token');

    if (!token) {
      return;
    }

    const loadReports = async () => {
      try {
        const backendReports = await interviewService.getUserReports();
        if (backendReports.length > 0) {
          setReports(backendReports.map(normalizeReport));
        }
      } catch {
        // Keep local/fallback reports if backend reports are not available.
      }
    };

    void loadReports();
  }, []);

  // Sync reports with local storage
  useEffect(() => {
    localStorage.setItem('mockmate_reports', JSON.stringify(reports));
  }, [reports]);

  // Sync activeSession with local storage
  useEffect(() => {
    if (activeSession) {
      try {
        localStorage.setItem('mockmate_active_interview_session', JSON.stringify(activeSession));
        console.log('[DEBUG] refresh synchronization - activeSession saved to localStorage:', activeSession);
      } catch (err) {
        console.error('[DEBUG] Failed to save activeSession to localStorage:', err);
      }
    } else {
      console.log('[DEBUG] refresh synchronization - activeSession is null, clearing localStorage');
      localStorage.removeItem('mockmate_active_interview_session');
      localStorage.removeItem('mockmate_active_interview_id');
    }
  }, [activeSession]);

  // Handle active session timer countdown
  useEffect(() => {
    if (activeSession && activeSession.isActive && !activeSession.isPaused) {
      timerRef.current = setInterval(() => {
        setActiveSession((prev) => {
          if (!prev) return null;
          
          // Generate mock real-time data for camera sensors
          const newConfidence = Math.min(
            100,
            Math.max(50, (prev.confidenceHistory[prev.confidenceHistory.length - 1] || 75) + (Math.random() * 10 - 5))
          );
          const newEyeContact = Math.min(
            100,
            Math.max(30, (prev.eyeContactHistory[prev.eyeContactHistory.length - 1] || 80) + (Math.random() * 14 - 7))
          );

          return {
            ...prev,
            elapsedTime: prev.elapsedTime + 1,
            timeRemaining: Math.max(0, prev.timeRemaining - 1),
            confidenceHistory: [...prev.confidenceHistory, Math.round(newConfidence)].slice(-60), // Keep last 60s
            eyeContactHistory: [...prev.eyeContactHistory, Math.round(newEyeContact)].slice(-60),
          };
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSession?.isActive, activeSession?.isPaused]);

  const startInterview = (company: string, role: string, durationMinutes: number, customQuestions?: Question[]) => {
    const questions = customQuestions || sortQuestionsByDifficulty(company);
    const totalDuration = durationMinutes * 60;

    const session: InterviewSession = {
      id: `session_${Date.now()}`,
      companyName: company,
      role: role || 'Software Developer',
      durationMinutes,
      questions,
      currentQuestionIndex: 0,
      isActive: true,
      isPaused: false,
      timeRemaining: totalDuration,
      elapsedTime: 0,
      cameraEnabled: true,
      micEnabled: true,
      transcripts: {},
      confidenceHistory: [80],
      eyeContactHistory: [85],
    };

    // Prefill transcript buffers
    questions.forEach((q) => {
      session.transcripts[q.id] = '';
    });

    setActiveSession(session);
    toast.success(`Mock Interview for ${company} started!`);

    const difficulty: 'easy' | 'medium' | 'hard' =
      durationMinutes <= 20 ? 'easy' : durationMinutes <= 45 ? 'medium' : 'hard';

    const syncInterviewToBackend = async () => {
      try {
        console.log('[DEBUG] interview start payload:', {
          role: role || 'Software Engineer',
          company,
          difficulty,
        });

        const started = await interviewService.startInterview({
          role: role || 'Software Engineer',
          company,
          difficulty,
        });

        console.log('[DEBUG] interview start response:', started);
        const interviewId = started?.interview?._id;
        
        if (!interviewId) {
          console.error('[DEBUG] Failed to start interview - invalid response structure:', started);
          return;
        }

        console.log('[DEBUG] token generation - interviewId:', interviewId);
        
        // Ensure storage key is exactly: mockmate_active_interview_id
        // Ensure storage happens only after successful API response
        // Verify no undefined/null values are being stored
        localStorage.setItem('mockmate_active_interview_id', interviewId);
        console.log('[DEBUG] localStorage save - mockmate_active_interview_id:', interviewId);

        for (const q of questions) {
          await interviewService.addQuestion(interviewId, q.text);
        }

        setActiveSession((prev) => {
          if (!prev) return null;
          const updated = { ...prev, backendInterviewId: interviewId };
          localStorage.setItem('mockmate_active_interview_session', JSON.stringify(updated));
          return updated;
        });

        console.log('[DEBUG] refresh synchronization - active session synced to backend ID:', interviewId);
      } catch (err) {
        console.error('[DEBUG] Error syncing interview to backend:', err);
        toast('Backend sync unavailable. Running interview in local mode.', { icon: '⚠️' });
      }
    };

    void syncInterviewToBackend();
  };

  const nextQuestion = () => {
    if (!activeSession) return;
    const { currentQuestionIndex, questions } = activeSession;
    if (currentQuestionIndex < questions.length - 1) {
      setActiveSession({
        ...activeSession,
        currentQuestionIndex: currentQuestionIndex + 1,
      });
      toast('Moving to the next question...', { icon: '➡️' });
    }
  };

  const prevQuestion = () => {
    if (!activeSession) return;
    const { currentQuestionIndex } = activeSession;
    if (currentQuestionIndex > 0) {
      setActiveSession({
        ...activeSession,
        currentQuestionIndex: currentQuestionIndex - 1,
      });
    }
  };

  const generateNextQuestion = async () => {
    if (!activeSession) return;

    const interviewId = activeSession.backendInterviewId;
    if (!interviewId) {
      toast.error("Active interview has no valid backend ID. Cannot generate question.");
      return;
    }

    setIsGeneratingNext(true);
    const toastId = toast.loading("Consulting AI to generate next dynamic question...");
    console.log(`[DEBUG] AI generation start - Requesting follow-up question for interview: ${interviewId}`);

    try {
      const newQuestion = await interviewService.generateNextQuestion(interviewId);

      setActiveSession((prev) => {
        if (!prev) return null;

        const updatedQuestions = [...prev.questions, newQuestion];
        const updatedTranscripts = {
          ...prev.transcripts,
          [newQuestion.id]: "",
        };

        const updatedSession = {
          ...prev,
          questions: updatedQuestions,
          transcripts: updatedTranscripts,
          currentQuestionIndex: updatedQuestions.length - 1,
        };

        localStorage.setItem('mockmate_active_interview_session', JSON.stringify(updatedSession));
        return updatedSession;
      });

      toast.success("Successfully generated and appended next question!", { id: toastId });
    } catch (err: any) {
      console.error("[DEBUG] Failed to generate next question:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to generate next question.", { id: toastId });
    } finally {
      setIsGeneratingNext(false);
    }
  };

  const pauseInterview = () => {
    if (!activeSession) return;
    setActiveSession({ ...activeSession, isPaused: true });
    toast.success('Interview paused.');
  };

  const resumeInterview = () => {
    if (!activeSession) return;
    setActiveSession({ ...activeSession, isPaused: false });
    toast.success('Interview resumed.');
  };

  const toggleCamera = () => {
    if (!activeSession) return;
    setActiveSession({ ...activeSession, cameraEnabled: !activeSession.cameraEnabled });
    toast(activeSession.cameraEnabled ? 'Camera disabled' : 'Camera enabled', { icon: '📷' });
  };

  const toggleMic = () => {
    if (!activeSession) return;
    setActiveSession({ ...activeSession, micEnabled: !activeSession.micEnabled });
    toast(activeSession.micEnabled ? 'Microphone muted' : 'Microphone unmuted', { icon: '🎤' });
  };

  const appendTranscript = (text: string) => {
    if (!activeSession) return;
    const currentQ = activeSession.questions[activeSession.currentQuestionIndex];
    setActiveSession((prev) => {
      if (!prev) return null;
      const currentText = prev.transcripts[currentQ.id] || '';
      return {
        ...prev,
        transcripts: {
          ...prev.transcripts,
          [currentQ.id]: currentText + ' ' + text,
        },
      };
    });
  };

  const endInterview = async (): Promise<InterviewReport> => {
    setIsSubmittingSession(true);
    // Simulate scoring calculations
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (!activeSession) {
      setIsSubmittingSession(false);
      throw new Error('No active interview session found');
    }

    // Calculate mock analytics scores
    const avgConfidence = Math.round(
      activeSession.confidenceHistory.reduce((a, b) => a + b, 0) / activeSession.confidenceHistory.length
    );
    const avgEyeContact = Math.round(
      activeSession.eyeContactHistory.reduce((a, b) => a + b, 0) / activeSession.eyeContactHistory.length
    );
    const techScore = Math.floor(Math.random() * 15) + 80; // 80 - 95
    const commScore = Math.floor(Math.random() * 20) + 75; // 75 - 95
    const overallScore = Math.round((avgConfidence + techScore + commScore) / 3);

    const summaries = activeSession.questions.map((q) => {
      const userAns = activeSession.transcripts[q.id]?.trim() || '';
      const textLength = userAns.split(' ').filter(Boolean).length;
      let finalAnswer = userAns;
      let mockFeedback = 'Your solution was structured well but was quite brief. Try elaborating on the implementation.';
      let scoreVal = 75;

      if (textLength === 0) {
        finalAnswer = '[No answer provided; user remained silent]';
        mockFeedback = 'No response was recorded. Make sure to attempt the question, vocally explaining your thought process even if you do not know the full answer.';
        scoreVal = 0;
      } else if (textLength > 30) {
        mockFeedback = 'Demonstrated strong communication skills and hit key criteria. Well structured answer.';
        scoreVal = Math.floor(Math.random() * 10) + 85;
      }

      return {
        question: q.text,
        answer: finalAnswer,
        feedback: mockFeedback,
        score: scoreVal,
      };
    });

    const performanceTags: string[] = [];
    if (overallScore < 65) performanceTags.push('Beginner');
    if (techScore < 75) performanceTags.push('Lack in coding strength');
    if (avgConfidence < 75) performanceTags.push('Build more confidence');
    if (commScore < 75) performanceTags.push('Improve communication');
    if (avgEyeContact < 70) performanceTags.push('Enhance eye contact');
    if (performanceTags.length === 0) performanceTags.push('Ready for next-level interviews');

    const performanceLevel = overallScore >= 90
      ? 'Advanced'
      : overallScore >= 75
      ? 'Skilled'
      : overallScore >= 60
      ? 'Developing'
      : 'Beginner';

    let finalReport: InterviewReport = {
      id: `rep_${Date.now()}`,
      companyName: activeSession.companyName,
      role: activeSession.role,
      date: new Date().toISOString().split('T')[0],
      overallScore,
      confidenceScore: avgConfidence,
      communicationScore: commScore,
      technicalScore: techScore,
      fillerWordCount: Math.floor(Math.random() * 8) + 4,
      eyeContactRatio: avgEyeContact,
      performanceLevel,
      performanceTags,
      transcriptSummary: summaries,
      suggestions: [
        `Excellent overall structure on your behavioral queries. Your confidence averages around ${avgConfidence}%.`,
        'Keep up the strong eye contact; you sustained gaze concentration for long spans.',
        'Try to expand more on coding spatial constraints in technical questions.',
      ],
    };

    try {
      if (activeSession.backendInterviewId) {
        for (let index = 0; index < activeSession.questions.length; index++) {
          const question = activeSession.questions[index];
          const answer = activeSession.transcripts[question.id] || '';

          await interviewService.submitAnswer(activeSession.backendInterviewId, index, answer);
        }

        await interviewService.endInterview(activeSession.backendInterviewId);
        const generated = await interviewService.generateReport(activeSession.backendInterviewId);
        const backendReports = await interviewService.getUserReports();

        const generatedId = generated?.report?._id;
        const generatedReport = backendReports.find((r) => r.id === generatedId) || backendReports[0];

        if (generatedReport) {
          finalReport = {
            ...generatedReport,
            fillerWordCount: finalReport.fillerWordCount,
            eyeContactRatio: finalReport.eyeContactRatio,
            transcriptSummary: finalReport.transcriptSummary,
            suggestions: finalReport.suggestions,
          };

          setReports([finalReport, ...backendReports.filter((r) => r.id !== finalReport.id)]);
        } else {
          setReports((prev) => [finalReport, ...prev]);
        }
      } else {
        setReports((prev) => [finalReport, ...prev]);
      }
    } catch {
      setReports((prev) => [finalReport, ...prev]);
    }

    setActiveSession(null);
    setIsSubmittingSession(false);
    toast.success('Interview analysis complete! Report generated.');
    return finalReport;
  };

  const clearSession = () => {
    setActiveSession(null);
  };

  return (
    <InterviewContext.Provider
      value={{
        activeSession,
        reports,
        isSubmittingSession,
        isGeneratingNext,
        startInterview,
        nextQuestion,
        prevQuestion,
        generateNextQuestion,
        pauseInterview,
        resumeInterview,
        toggleCamera,
        toggleMic,
        appendTranscript,
        endInterview,
        clearSession,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
