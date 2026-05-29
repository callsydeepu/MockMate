// src/pages/interview/InterviewSession.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useInterview, type Question } from '../../context/interview/InterviewContext';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Video, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { ResultReport } from '../../components/interview/ResultReport';

export const InterviewSession: React.FC = () => {
  const location = useLocation();
  const { state } = location as any; // state: { company: string; role: string }
const navigate = useNavigate();
  const {
    activeSession,
    startInterview,
    nextQuestion,
    prevQuestion,
    toggleCamera,
    toggleMic,
    appendTranscript,
    endInterview,
  } = useInterview();

  const [report, setReport] = useState<any>(null);
  const [transcriptInput, setTranscriptInput] = useState('');

  // Initialise interview on mount if not already started
  useEffect(() => {
    // If activeSession is already restored (e.g., on app refresh), do not redirect or re-initialize.
    if (activeSession) {
      console.log('[DEBUG] refresh synchronization - active session successfully restored in InterviewSession room:', activeSession);
      return;
    }
    if (!state?.company || !state?.role) {
      console.warn('[DEBUG] redirecting - state setup data is missing and no active session restored');
      toast.error('Interview setup data missing. Redirecting...');
      navigate('/interview/setup');
      return;
    }
    console.log('[DEBUG] starting new interview session since no active session exists');
    startInterview(state.company, state.role, 30);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, activeSession, navigate, startInterview]);

  if (!activeSession) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-300">
        Loading interview session…
      </div>
    );
  }

  const currentQ: Question = activeSession.questions[activeSession.currentQuestionIndex];

  const handleAnswer = () => {
    if (transcriptInput.trim()) {
      appendTranscript(transcriptInput.trim());
      setTranscriptInput('');
    }
  };

  const handleSubmit = async () => {
    const rep = await endInterview();
    setReport(rep);
  };

  return (
    <div className="flex flex-col bg-transparent text-slate-800 pb-12">
      {/* Header with media toggles */}
      <header className="flex justify-end p-4 space-x-4">
        <button 
          onClick={toggleCamera} 
          className={`p-2.5 rounded-full border transition-all ${
            activeSession.cameraEnabled 
              ? 'bg-violet-600/10 border-violet-500/20 text-violet-600 hover:bg-violet-600/20' 
              : 'bg-red-500/10 border-red-500/20 text-red-600 hover:bg-red-500/20'
          }`}
          title={activeSession.cameraEnabled ? "Turn off camera" : "Turn on camera"}
        >
          <Video className="w-5 h-5" />
        </button>
        <button 
          onClick={toggleMic} 
          className={`p-2.5 rounded-full border transition-all ${
            activeSession.micEnabled 
              ? 'bg-violet-600/10 border-violet-500/20 text-violet-600 hover:bg-violet-600/20' 
              : 'bg-red-500/10 border-red-500/20 text-red-600 hover:bg-red-500/20'
          }`}
          title={activeSession.micEnabled ? "Mute microphone" : "Unmute microphone"}
        >
          <Mic className="w-5 h-5" />
        </button>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden gap-6 px-4">
        {/* Left: Webcam view */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-slate-100/80 rounded-2xl border border-slate-200/50 p-4 min-h-[300px] shadow-sm">
          {activeSession.cameraEnabled ? (
            <Webcam
              audio={activeSession.micEnabled}
              videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
              className="rounded-xl shadow-md border border-slate-200/30 object-cover scale-x-[-1]"
            />
          ) : (
            <div className="text-center space-y-2 text-slate-500">
              <Video className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
              <p className="text-xs font-bold font-mono tracking-wider">Biometric camera offline</p>
            </div>
          )}
        </div>

        {/* Right: Question panel */}
        <div className="w-full md:w-1/2 flex flex-col bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-slate-200/50 shadow-sm justify-between">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <h2 className="text-lg font-display font-extrabold text-slate-900 mb-2">Question {activeSession.currentQuestionIndex + 1}</h2>
            <p className="mb-6 text-sm text-slate-700 font-semibold leading-relaxed">"{currentQ.text}"</p>

            <textarea
              value={transcriptInput}
              onChange={(e) => setTranscriptInput(e.target.value)}
              placeholder="Speak your answer or type here…"
              className="w-full h-36 p-4 rounded-xl bg-white/80 border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-slate-900 placeholder:text-slate-400 resize-none text-xs leading-relaxed"
            />
            <button
              onClick={() => {
                // Mock capture of facial/body language and voice analytics
                console.log('Capturing facial and voice analytics for answer');
                handleAnswer();
              }}
              className="mt-3.5 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-bold transition-all text-xs cursor-pointer shadow-md shadow-violet-500/5"
            >
              Save Answer & Capture Analytics
            </button>
          </motion.div>

          {/* Navigation controls */}
          <div className="flex justify-between mt-8 pt-4 border-t border-slate-200/40">
            <button
              onClick={prevQuestion}
              disabled={activeSession.currentQuestionIndex === 0}
              className="flex items-center px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl text-xs disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Prev
            </button>
            {activeSession.currentQuestionIndex < activeSession.questions.length - 1 ? (
              <button
                onClick={nextQuestion}
                className="flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-bold text-xs transition-colors cursor-pointer shadow-md shadow-violet-500/5"
              >
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold text-xs transition-colors cursor-pointer shadow-md shadow-emerald-500/5"
              >
                Submit & Review <CheckCircle className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Result report modal */}
      <AnimatePresence>
        {report && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultReport report={report} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
