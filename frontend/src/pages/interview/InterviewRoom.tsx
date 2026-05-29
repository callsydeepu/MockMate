import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Building2, UserCircle, Play, Zap, FileText, Mic } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useInterview, type Question } from '../../context/interview/InterviewContext';
import { aiService } from '../../services/aiService';
import { toast } from 'react-hot-toast';
import { WebcamPanel } from '../../components/interview/WebcamPanel';
import { MicrophonePanel } from '../../components/interview/MicrophonePanel';
import { QuestionCard } from '../../components/interview/QuestionCard';
import { ConfidenceMeter } from '../../components/interview/ConfidenceMeter';
import { InterviewControls } from '../../components/interview/InterviewControls';
import { SessionSummaryModal } from '../../components/interview/SessionSummaryModal';




// Custom TypeScript declarations for Browser Web Speech API
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  readonly isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}



const InterviewRoom: React.FC = () => {
  const { 
    activeSession, 
    startInterview, 
    nextQuestion, 
    pauseInterview,
    resumeInterview,
    toggleCamera, 
    toggleMic, 
    submitCurrentAnswer,
    endInterview,
    clearSession,
    isSubmittingSession,
    isGeneratingNext,
    generateNextQuestion
  } = useInterview();

  const navigate = useNavigate();

  // Selection states
  const [company, setCompany] = useState('Google');
  const [role, setRole] = useState('Software Engineer');
  const [duration, setDuration] = useState('30');

  // AI Coach states
  const [activeTab, setActiveTab] = useState<'standard' | 'ai'>('standard');
  const [techStack, setTechStack] = useState('React, TypeScript, Node.js');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [aiQuestions, setAiQuestions] = useState<Question[] | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleGenerateAI = async () => {
    if (!role.trim() || !company.trim() || !techStack.trim()) {
      toast.error('Please specify target role, company, and tech stack parameters!');
      return;
    }
    setIsGeneratingAI(true);
    const toastId = toast.loading('Consulting Grok AI to compile customized questions...');
    try {
      const questions = await aiService.generateQuestions({
        role,
        company,
        techStack,
        difficulty,
      });
      setAiQuestions(questions);
      toast.success('Successfully compiled 3 tailored AI interview questions!', { id: toastId });
    } catch (err: any) {
      console.error('[DEBUG] AI generation failed:', err);
      toast.error(err?.message || 'Failed to generate questions. Please try again.', { id: toastId });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleStartAIInterview = () => {
    if (!aiQuestions || aiQuestions.length === 0) return;
    console.log('[DEBUG] starting AI interview with generated questions:', aiQuestions);
    startInterview(company, role, parseInt(duration, 10), aiQuestions);
    setIsRoomConfigured(true);
  };
  const [isRoomConfigured, setIsRoomConfigured] = useState(() => {
    const hasSession = !!localStorage.getItem('mockmate_active_interview_id');
    console.log('[DEBUG] InterviewRoom initialization - isRoomConfigured:', hasSession);
    return hasSession;
  });

  // Keep isRoomConfigured synchronized with activeSession transitions
  useEffect(() => {
    if (activeSession) {
      console.log('[DEBUG] refresh synchronization - active session found, auto-configuring InterviewRoom');
      setIsRoomConfigured(true);
    } else {
      console.log('[DEBUG] refresh synchronization - no active session found, showing setup');
      setIsRoomConfigured(false);
    }
  }, [activeSession]);

  // Modal scoring states
  const [modalOpen, setModalOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<any>(null);

  // Controlled typed answer state variables
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const baselineTextRef = React.useRef<string>('');

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
      setMicPermissionError(null);
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("[Speech Error] Recognition error:", event.error);
      if (event.error === 'not-allowed') {
        setMicPermissionError("Mic blocked");
        toast.error("Microphone permission denied. Please allow mic access in your browser settings.");
      } else if (event.error === 'no-speech') {
        console.warn("[Speech Info] No speech detected, stopping listening automatically.");
      } else {
        toast.error(`Speech recognition error: ${event.error}`);
      }
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.onresult = (event: SpeechRecognitionEvent) => {
      console.log(`[Speech Debug] Received result event. Result length: ${event.results.length}, active index: ${event.resultIndex}`);
      let sessionTranscript = '';
      
      for (let i = 0; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result && result[0]) {
          sessionTranscript += result[0].transcript;
        }
      }
      
      console.log("[Speech Debug] Cumulative session transcript parsed:", sessionTranscript);
      const prefix = baselineTextRef.current ? baselineTextRef.current.trim() + ' ' : '';
      setTypedAnswer(prefix + sessionTranscript.trim());
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!isSpeechSupported || !recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser. Please use Google Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setMicPermissionError(null);
      baselineTextRef.current = typedAnswer;
      
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err: any) {
        console.error("[Speech Error] Could not start speech recognition:", err);
        setIsListening(false);
      }
    }
  };

  // Sync state when active session or current question changes
  useEffect(() => {
    if (activeSession) {
      // Auto-stop listening when transitioning to a new question
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }

      const currentQ = activeSession.questions[activeSession.currentQuestionIndex];
      const existingAnswer = activeSession.transcripts[currentQ.id] || '';
      setTypedAnswer(existingAnswer);
      setIsAnswerSubmitted(existingAnswer.trim().length > 0);
    }
  }, [activeSession?.currentQuestionIndex, activeSession?.questions]);

  const handleSubmitAnswerClick = async () => {
    if (!typedAnswer.trim()) {
      toast.error('Please enter an answer before submitting!');
      return;
    }
    
    // Auto-stop listening when submitting answer
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsSubmittingAnswer(true);
    try {
      const ok = await submitCurrentAnswer(typedAnswer);
      if (ok) {
        setIsAnswerSubmitted(true);
      }
    } catch (err) {
      console.error('[DEBUG] Failed to submit typed answer:', err);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleStart = () => {
    startInterview(company, role, parseInt(duration, 10));
    setIsRoomConfigured(true);
  };

  const handleEnd = async () => {
    setModalOpen(true);
    try {
      const rep = await endInterview();
      setCurrentReport(rep);
    } catch (err) {
      console.error('Error generating report', err);
      setModalOpen(false);
    }
  };

  const handleViewReport = () => {
    setModalOpen(false);
    clearSession();
    navigate('/reports', { state: { reportId: currentReport?.id } });
  };

  // 1. SETUP / CONFIGURATION PANEL
  if (!isRoomConfigured || !activeSession) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pt-6">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 flex items-center gap-2">
            Configure Interview Space <Sparkles className="w-5 h-5 text-violet-600 animate-pulse" />
          </h1>
          <p className="text-slate-600 text-xs font-semibold">
            Choose your parameters to initialize target question banks and biometric modules.
          </p>
        </div>

        {/* Segmented tab selection */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 w-full">
          <button
            onClick={() => setActiveTab('standard')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'standard'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Standard Mocks Bank
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex justify-center items-center gap-1.5 cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> AI Grok Coach (Beta)
          </button>
        </div>

        {activeTab === 'standard' ? (
          <Card className="border-slate-200/50 space-y-5 relative shadow-sm">
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-violet-600/5 blur-2xl rounded-full" />
            {/* Company select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-violet-500" /> Target Company
              </label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-white/80 border border-slate-200/60 text-slate-900 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
              >
                <option value="Google">Google</option>
                <option value="Amazon">Amazon</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Meta">Meta</option>
                <option value="Apple">Apple</option>
                <option value="General">General Mock Prep</option>
              </select>
            </div>

            {/* Role select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <UserCircle className="w-4 h-4 text-sky-600" /> Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-white/80 border border-slate-200/60 text-slate-900 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Cloud Engineer">Cloud Engineer</option>
              </select>
            </div>

            {/* Duration select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Play className="w-4 h-4 text-sky-600" /> Interview Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-white/80 border border-slate-200/60 text-slate-900 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
              </select>
            </div>

            {/* Trigger */}
            <div className="pt-4">
              <Button
                variant="primary"
                onClick={handleStart}
                icon={<Play className="w-4 h-4" />}
                className="w-full py-3 rounded-xl font-bold shadow-md shadow-violet-500/10"
              >
                Initialize Mock Room
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border-slate-200/50 space-y-5 bg-white/70 backdrop-blur-sm relative shadow-sm">
              <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-cyan-400/5 blur-2xl rounded-full" />
              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <UserCircle className="w-4 h-4 text-sky-600" /> Target Role / Profile
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Frontend Engineer, Senior Fullstack Dev"
                  className="w-full px-4 py-2.5 text-xs bg-white/80 border border-slate-200/60 text-slate-900 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                />
              </div>

              {/* Company */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-violet-500" /> Target Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Stripe, OpenAI"
                  className="w-full px-4 py-2.5 text-xs bg-white/80 border border-slate-200/60 text-slate-900 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                />
              </div>

              {/* Tech Stack */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" /> Core Tech Stack
                </label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="e.g. React, Node.js, TypeScript, Docker"
                  className="w-full px-4 py-2.5 text-xs bg-white/80 border border-slate-200/60 text-slate-900 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                />
              </div>

              {/* Difficulty select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-violet-500" /> Complexity / Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-4 py-2.5 text-xs bg-white/80 border border-slate-200/60 text-slate-900 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                >
                  <option value="easy">Simple / Junior</option>
                  <option value="medium">Moderate / Mid-Level</option>
                  <option value="hard">Advanced / Senior</option>
                </select>
              </div>

              {/* Duration select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Play className="w-4 h-4 text-sky-600" /> Duration Limit
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-white/80 border border-slate-200/60 text-slate-900 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                </select>
              </div>

              {/* Prompt Customizer Preview */}
              <div className="p-3 rounded-lg border border-slate-200/50 bg-slate-50/70 text-[10px] text-slate-600 font-mono space-y-1">
                <span className="text-[9px] uppercase font-bold text-violet-600 block tracking-wider font-sans">Prompt Template Builder Preview</span>
                <p className="leading-relaxed">
                  "Compile 3 custom questions matching targeting role {role || '[Role]'} at {company || '[Company]'} centered around technologies [{techStack || '[Tech Stack]'}] on a {difficulty} scale."
                </p>
              </div>

              {/* AI Trigger */}
              <div className="pt-4">
                <Button
                  variant="primary"
                  loading={isGeneratingAI}
                  onClick={handleGenerateAI}
                  icon={<Zap className="w-4 h-4" />}
                  className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-violet-650 to-sky-600 border-none text-white hover:opacity-90 shadow-md shadow-violet-500/10"
                >
                  Generate AI Interview Questions
                </Button>
              </div>
            </Card>

            {/* AI Questions Preview Panel */}
            {aiQuestions && aiQuestions.length > 0 && (
              <Card className="border-slate-200/50 bg-white/70 p-6 space-y-5 shadow-sm animate-fade-in">
                <div className="space-y-1">
                  <h3 className="text-xs uppercase font-black text-slate-700 tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-500" /> Compiled Questions Preview
                  </h3>
                  <p className="text-[10px] text-slate-600 font-semibold">AI generated questions specifically tailored for this prep</p>
                </div>

                <div className="space-y-4">
                  {aiQuestions.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200/50 bg-slate-50/70 space-y-2.5 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-sky-600 uppercase font-bold">Q-0{idx + 1} • {q.category}</span>
                        <span className="text-[9px] font-mono text-violet-600 uppercase font-bold">{q.difficulty}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-relaxed">"{q.text}"</p>
                      
                      <div className="p-2.5 rounded-lg border border-slate-200/50 bg-white/50 text-[10px] text-slate-600 space-y-1 font-medium">
                        <span className="text-[8px] font-mono text-sky-600 uppercase font-bold block">Interviewer Tips</span>
                        {q.tips.map((t, tIdx) => (
                          <p key={tIdx} className="leading-snug">• {t}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    onClick={handleStartAIInterview}
                    icon={<Play className="w-4 h-4 animate-pulse" />}
                    className="w-full py-3.5 rounded-xl font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-500/10"
                  >
                    Initialize AI Mock Room
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    );
  }

  // Helper values
  const currentQuestion = activeSession.questions[activeSession.currentQuestionIndex];
  const latestConfidence = activeSession.confidenceHistory[activeSession.confidenceHistory.length - 1] || 75;
  const latestEyeContact = activeSession.eyeContactHistory[activeSession.eyeContactHistory.length - 1] || 80;

  // 2. ACTIVE INTERVIEW ROOM VIEW
  return (
    <div className="space-y-6">
      {/* Upper Status row */}
      <div className="flex justify-between items-center bg-white/80 p-4 rounded-2xl border border-slate-200/50 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <span className="text-xs font-display font-extrabold text-slate-900 uppercase tracking-wider">
            {activeSession.companyName} SIMULATION ({activeSession.role})
          </span>
        </div>
        
        {/* Timer countdown (reusable common component) */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-semibold">
          <span>Overall elapsed: {Math.floor(activeSession.elapsedTime / 60)}m</span>
          <span className="px-2 py-1 bg-white border border-slate-200/60 rounded-lg text-slate-700">Duration: {activeSession.durationMinutes} mins</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Camera, Mic waveform, Confidence sparkline (5/12 grid) */}
        <div className="lg:col-span-5 space-y-4">
          <WebcamPanel 
            enabled={activeSession.cameraEnabled} 
            confidenceScore={latestConfidence}
            eyeContactRatio={latestEyeContact}
          />
          <MicrophonePanel 
            enabled={activeSession.micEnabled} 
            isRecording={isListening} 
          />
          <ConfidenceMeter 
            score={latestConfidence}
            history={activeSession.confidenceHistory}
          />
        </div>

        {/* RIGHT COLUMN: AI Interviewer card, Question tips, Live transcripts (7/12 grid) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col h-full">
          {/* Fake AI Interviewer Avatar Card */}
          <div className="p-4 rounded-2xl glass-card flex items-center gap-4 border-slate-200/50 bg-white/70 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-sky-400 flex items-center justify-center text-white font-black shadow-lg">
              AI
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Interviewer Avatar (Agent X-1)</span>
              <span className="text-[10px] text-slate-600 block leading-relaxed font-semibold">
                Adapts questions to technical depth, assessing communication fluency.
              </span>
            </div>
          </div>

          <QuestionCard
            question={currentQuestion}
            currentIndex={activeSession.currentQuestionIndex}
            totalQuestions={activeSession.questions.length}
          />

          {/* Typed Answer Response Panel */}
          <div className="glass-card flex flex-col justify-between border-slate-200/50 p-5 space-y-4 rounded-2xl bg-white/70 backdrop-blur-md shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
              <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">Your Response Space</span>
              {isAnswerSubmitted ? (
                <span className="inline-flex items-center gap-1 text-[8px] font-bold text-emerald-700 border border-emerald-400/20 bg-emerald-50 px-2 py-0.5 rounded uppercase font-mono">
                  Saved & Synced
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[8px] font-bold text-amber-700 border border-amber-400/20 bg-amber-50 px-2 py-0.5 rounded uppercase font-mono">
                  Awaiting Submission
                </span>
              )}
            </div>

            <textarea
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              disabled={isSubmittingAnswer || activeSession.isPaused}
              placeholder="Type your structured, comprehensive answer here... Try to elaborate on technical edge cases, architecture decisions, and explain your thought process clearly!"
              className="w-full flex-grow p-4 text-xs bg-white/80 border border-slate-200/60 rounded-xl text-slate-900 focus:outline-none focus:border-violet-500 disabled:opacity-50 min-h-[140px] resize-none leading-relaxed font-sans placeholder:text-slate-400 font-medium"
            />

            <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-slate-600 font-semibold font-mono">
                  Character count: {typedAnswer.length}
                </span>
                {isListening && (
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-sky-600 font-mono ml-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                    Listening...
                  </span>
                )}
                {micPermissionError && (
                  <span className="text-[9px] text-red-650 font-bold ml-2">
                    {micPermissionError}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {isSpeechSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    disabled={activeSession.isPaused || isSubmittingAnswer}
                    className={`p-2.5 rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                      isListening
                        ? 'bg-sky-50 border-sky-300 text-sky-600 hover:bg-sky-100 shadow-[0_0_12px_rgba(2,132,197,0.15)] animate-pulse'
                        : 'bg-white/80 border-slate-200/60 text-slate-500 hover:text-slate-800 hover:border-slate-300'
                    }`}
                    title={isListening ? "Stop Voice Transcription" : "Start Voice Transcription"}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                )}

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmitAnswerClick}
                  loading={isSubmittingAnswer}
                  disabled={isSubmittingAnswer || activeSession.isPaused || !typedAnswer.trim()}
                  className="rounded-xl px-4 py-2 text-xs font-bold shadow-md shadow-violet-500/10"
                >
                  {isAnswerSubmitted ? "Update Stored Answer" : "Submit Answer"}
                </Button>
              </div>
            </div>
          </div>

          {/* Previous Answers Timeline Preview */}
          {activeSession.currentQuestionIndex > 0 && (
            <div className="glass-card p-5 border-slate-200/50 space-y-4 rounded-2xl bg-white/70 shadow-sm">
              <h3 className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">Previous Responses Timeline</h3>
              <div className="space-y-4 max-h-[160px] overflow-y-auto scrollbar-thin pr-1">
                {activeSession.questions.slice(0, activeSession.currentQuestionIndex).map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200/50 bg-slate-50/70 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center text-[9px] font-mono text-sky-600 uppercase font-bold">
                      <span>Question 0{idx + 1} • {q.category}</span>
                      <span className="text-slate-500 font-semibold">{q.difficulty}</span>
                    </div>
                    <p className="text-slate-800 font-bold leading-relaxed">"{q.text}"</p>
                    <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-[11px] text-emerald-800 leading-relaxed font-semibold">
                      <span className="text-[8px] font-mono text-emerald-700 uppercase font-black block tracking-wider mb-1">Your Submitted Response</span>
                      "{activeSession.transcripts[q.id] || '[No answer recorded]'}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control panel row */}
      <InterviewControls
        cameraEnabled={activeSession.cameraEnabled}
        micEnabled={activeSession.micEnabled}
        isPaused={activeSession.isPaused}
        isFirstQuestion={activeSession.currentQuestionIndex === 0}
        isLastQuestion={activeSession.currentQuestionIndex === activeSession.questions.length - 1}
        isGeneratingNext={isGeneratingNext}
        isAnswerSubmitted={isAnswerSubmitted}
        onToggleCamera={toggleCamera}
        onToggleMic={toggleMic}
        onPause={pauseInterview}
        onResume={resumeInterview}
        onNext={nextQuestion}
        onGenerateNext={generateNextQuestion}
        onEnd={handleEnd}
      />

      {/* Completion scorecards Modal */}
      <SessionSummaryModal
        isOpen={modalOpen}
        isAnalyzing={isSubmittingSession}
        report={currentReport}
        onViewReport={handleViewReport}
      />
    </div>
  );
};

export default InterviewRoom;
