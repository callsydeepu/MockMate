import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Building2, UserCircle, Play, Zap, FileText } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useInterview, type Question } from '../../context/interview/InterviewContext';
import { aiService } from '../../services/aiService';
import { toast } from 'react-hot-toast';
import { WebcamPanel } from '../../components/interview/WebcamPanel';
import { MicrophonePanel } from '../../components/interview/MicrophonePanel';
import { QuestionCard } from '../../components/interview/QuestionCard';
import { TranscriptPanel } from '../../components/interview/TranscriptPanel';
import { ConfidenceMeter } from '../../components/interview/ConfidenceMeter';
import { InterviewControls } from '../../components/interview/InterviewControls';
import { SessionSummaryModal } from '../../components/interview/SessionSummaryModal';

const MOCK_ANSWERS: { [key: string]: string[] } = {
  g_q1: [
    "In my last project, we had a disagreement regarding architecture.",
    "Specifically, one developer wanted to use vanilla CSS, and I suggested Tailwind for speed.",
    "We resolved it by scheduling a spike session to evaluate both options.",
    "We concluded that Tailwind saved us time, and agreed to proceed."
  ],
  g_q2: [
    "To solve the contiguous subarray, I would map 0s to -1s and keep a running sum.",
    "I would store the first index of each sum in a hash map.",
    "If the sum repeats, it means the elements in between add up to zero.",
    "Thus, we find the longest stretch, which takes O(N) time complexity."
  ],
  g_q3: [
    "Google Autocomplete requires low latency and high availability.",
    "I would store prefix trees or Tries inside a Redis cluster at the edge.",
    "To index new queries, I'd buffer logs into Kafka to aggregate them offline.",
    "This reduces real-time database queries and supports millions of lookups."
  ],
  a_q1: [
    "During my internship, a client API was crashing under load.",
    "We didn't have historical request parameters, so I had to make assumptions.",
    "I enabled debug tracing on staging to catch logs manually.",
    "This bias for action allowed us to patch the crash before users noticed."
  ],
  a_q2: [
    "To find the first non-repeating character, we need a frequency map.",
    "We count occurrences in a single pass of the string.",
    "In a second pass, we check the first character with a count of one.",
    "This is O(N) time and O(1) space since character set is fixed (ASCII 256)."
  ],
  gen_q1: [
    "I want to join MockMate because interview prep is highly stressful.",
    "MockMate's AI coaches can help candidates gain confidence in low-risk setups.",
    "My React skills and passion for tech make me an excellent fit to build features.",
    "I want to help engineering students crack placements."
  ]
};

const InterviewRoom: React.FC = () => {
  const { 
    activeSession, 
    startInterview, 
    nextQuestion, 
    pauseInterview,
    resumeInterview,
    toggleCamera, 
    toggleMic, 
    appendTranscript,
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

  useEffect(() => {
    let wordInterval: any = null;

    if (activeSession && activeSession.isActive && !activeSession.isPaused) {
      const currentQ = activeSession.questions[activeSession.currentQuestionIndex];
      const mockAnswersArray = MOCK_ANSWERS[currentQ.id] || (
        currentQ.category === 'behavioral' ? [
          "That is a great behavioral question.",
          "In my previous projects, I experienced a similar challenge with a teammate.",
          "I used a collaborative, STAR-based structured communication style.",
          "This resolved our conflict and ensured high quality delivery on time."
        ] : currentQ.category === 'system-design' ? [
          "For this system design problem, I would first gather technical constraints.",
          "I'd partition the system into high-availability microservices.",
          "We can cache volatile query trends using Redis at the edge layers.",
          "This ensures sub-100ms response times and handles scale perfectly."
        ] : [
          "To answer this technical question, let's explore its core concepts.",
          "In my stack, this is managed with efficient, scalable methods.",
          "We must balance compute constraints with spatial complexity metrics.",
          "This approach guarantees thread-safety and mitigates edge-case leaks."
        ]
      );
      let sentenceIndex = 0;

      // Every 5 seconds, append a sentence to simulate user speaking
      wordInterval = setInterval(() => {
        if (sentenceIndex < mockAnswersArray.length) {
          appendTranscript(mockAnswersArray[sentenceIndex] + ' ');
          sentenceIndex++;
        }
      }, 5000);
    }

    return () => {
      if (wordInterval) clearInterval(wordInterval);
    };
  }, [
    activeSession?.isActive, 
    activeSession?.isPaused, 
    activeSession?.currentQuestionIndex
  ]);

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
          <h1 className="text-xl md:text-2xl font-display font-extrabold text-white flex items-center gap-2">
            Configure Interview Space <Sparkles className="w-5 h-5 text-violet-400" />
          </h1>
          <p className="text-slate-400 text-xs font-medium">
            Choose your parameters to initialize target question banks and biometric modules.
          </p>
        </div>

        {/* Segmented tab selection */}
        <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 w-full">
          <button
            onClick={() => setActiveTab('standard')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'standard'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Standard Mocks Bank
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex justify-center items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> AI Grok Coach (Beta)
          </button>
        </div>

        {activeTab === 'standard' ? (
          <Card className="border-white/5 space-y-5 relative">
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-violet-600/5 blur-2xl rounded-full" />
            {/* Company select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-violet-400" /> Target Company
              </label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-2.5 text-xs glass-input bg-slate-900 border border-white/10 text-white rounded-lg focus:outline-none focus:border-violet-500"
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
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <UserCircle className="w-4 h-4 text-cyan-400" /> Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 text-xs glass-input bg-slate-900 border border-white/10 text-white rounded-lg focus:outline-none"
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
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Play className="w-4 h-4 text-cyan-400" /> Interview Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 text-xs glass-input bg-slate-900 border border-white/10 text-white rounded-lg focus:outline-none"
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
                className="w-full py-3 rounded-xl font-bold"
              >
                Initialize Mock Room
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border-white/5 space-y-5 bg-slate-950/20 backdrop-blur-sm relative">
              <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-cyan-400/5 blur-2xl rounded-full" />
              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <UserCircle className="w-4 h-4 text-cyan-400" /> Target Role / Profile
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Frontend Engineer, Senior Fullstack Dev"
                  className="w-full px-4 py-2.5 text-xs glass-input bg-slate-900 border border-white/10 text-white rounded-lg focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Company */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-violet-400" /> Target Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Stripe, OpenAI"
                  className="w-full px-4 py-2.5 text-xs glass-input bg-slate-900 border border-white/10 text-white rounded-lg focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Tech Stack */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" /> Core Tech Stack
                </label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="e.g. React, Node.js, TypeScript, Docker"
                  className="w-full px-4 py-2.5 text-xs glass-input bg-slate-900 border border-white/10 text-white rounded-lg focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Difficulty select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-violet-400" /> Complexity / Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-4 py-2.5 text-xs glass-input bg-slate-900 border border-white/10 text-white rounded-lg focus:outline-none focus:border-violet-500"
                >
                  <option value="easy">Simple / Junior</option>
                  <option value="medium">Moderate / Mid-Level</option>
                  <option value="hard">Advanced / Senior</option>
                </select>
              </div>

              {/* Duration select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Play className="w-4 h-4 text-cyan-400" /> Duration Limit
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs glass-input bg-slate-900 border border-white/10 text-white rounded-lg focus:outline-none focus:border-violet-500"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                </select>
              </div>

              {/* Prompt Customizer Preview */}
              <div className="p-3 rounded-lg border border-white/5 bg-slate-950/40 text-[10px] text-slate-400 font-mono space-y-1">
                <span className="text-[9px] uppercase font-bold text-violet-400 block tracking-wider font-sans">Prompt Template Builder Preview</span>
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
                  className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-cyan-500 border-none text-white hover:opacity-90 shadow-lg shadow-violet-500/10"
                >
                  Generate AI Interview Questions
                </Button>
              </div>
            </Card>

            {/* AI Questions Preview Panel */}
            {aiQuestions && aiQuestions.length > 0 && (
              <Card className="border-white/5 bg-slate-950/30 p-6 space-y-5">
                <div className="space-y-1">
                  <h3 className="text-xs uppercase font-black text-slate-300 tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-400" /> Compiled Questions Preview
                  </h3>
                  <p className="text-[10px] text-slate-500">AI generated questions specifically tailored for this prep</p>
                </div>

                <div className="space-y-4">
                  {aiQuestions.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-white/5 bg-slate-900/30 space-y-2.5 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold">Q-0{idx + 1} • {q.category}</span>
                        <span className="text-[9px] font-mono text-violet-400 uppercase font-bold">{q.difficulty}</span>
                      </div>
                      <p className="text-xs font-bold text-white leading-relaxed">"{q.text}"</p>
                      
                      <div className="p-2.5 rounded-lg border border-white/5 bg-slate-950/40 text-[10px] text-slate-400 space-y-1">
                        <span className="text-[8px] font-mono text-cyan-400 uppercase font-bold block">Interviewer Tips</span>
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
                    className="w-full py-3.5 rounded-xl font-bold bg-violet-600 hover:bg-violet-500 text-white"
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
      <div className="flex justify-between items-center bg-slate-950/40 p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <span className="text-xs font-display font-extrabold text-white uppercase tracking-wider">
            {activeSession.companyName} SIMULATION ({activeSession.role})
          </span>
        </div>
        
        {/* Timer countdown (reusable common component) */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span>Overall elapsed: {Math.floor(activeSession.elapsedTime / 60)}m</span>
          <span className="px-2 py-1 bg-slate-900/80 rounded-lg border border-white/10">Duration: {activeSession.durationMinutes} mins</span>
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
            isRecording={activeSession.isActive && !activeSession.isPaused} 
          />
          <ConfidenceMeter 
            score={latestConfidence}
            history={activeSession.confidenceHistory}
          />
        </div>

        {/* RIGHT COLUMN: AI Interviewer card, Question tips, Live transcripts (7/12 grid) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col h-full">
          {/* Fake AI Interviewer Avatar Card */}
          <div className="p-4 rounded-2xl glass-card flex items-center gap-4 border-white/5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-white font-black shadow-lg">
              AI
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Interviewer Avatar (Agent X-1)</span>
              <span className="text-[10px] text-slate-500 block leading-relaxed">
                Adapts questions to technical depth, assessing communication fluency.
              </span>
            </div>
          </div>

          <QuestionCard
            question={currentQuestion}
            currentIndex={activeSession.currentQuestionIndex}
            totalQuestions={activeSession.questions.length}
          />

          <TranscriptPanel
            transcript={activeSession.transcripts[currentQuestion.id] || ''}
          />
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
