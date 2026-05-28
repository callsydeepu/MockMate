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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-800 text-gray-100 flex flex-col">
      {/* Header with media toggles */}
      <header className="flex justify-end p-4 space-x-4">
        <button onClick={toggleCamera} className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition">
          <Video className="w-5 h-5" />
        </button>
        <button onClick={toggleMic} className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition">
          <Mic className="w-5 h-5" />
        </button>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Webcam view */}
        <div className="w-1/2 flex items-center justify-center bg-black/30 p-4">
          {activeSession.cameraEnabled && (
            <Webcam
              audio={activeSession.micEnabled}
              videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
              className="rounded-lg shadow-lg"
            />
          )}
        </div>

        {/* Right: Question panel */}
        <div className="w-1/2 flex flex-col p-6">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <h2 className="text-2xl font-semibold mb-4">Question {activeSession.currentQuestionIndex + 1}</h2>
            <p className="mb-6 text-lg">{currentQ.text}</p>

            <textarea
              value={transcriptInput}
              onChange={(e) => setTranscriptInput(e.target.value)}
              placeholder="Speak your answer or type here…"
              className="w-full h-32 p-3 rounded-lg bg-slate-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
            <button
              onClick={() => {
                // Mock capture of facial/body language and voice analytics
                console.log('Capturing facial and voice analytics for answer');
                handleAnswer();
              }}
              className="mt-3 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded text-white transition"
            >
              Save Answer & Capture Analytics
            </button>
          </motion.div>

          {/* Navigation controls */}
          <div className="flex justify-between mt-6">
            <button
              onClick={prevQuestion}
              disabled={activeSession.currentQuestionIndex === 0}
              className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Prev
            </button>
            {activeSession.currentQuestionIndex < activeSession.questions.length - 1 ? (
              <button
                onClick={nextQuestion}
                className="flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded text-white"
              >
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white"
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
