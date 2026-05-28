import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';
import { ScoreBadge } from '../common/ScoreBadge';
import type { InterviewReport } from '../../context/interview/InterviewContext';

interface SessionSummaryModalProps {
  isOpen: boolean;
  isAnalyzing: boolean;
  report: InterviewReport | null;
  onViewReport: () => void;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  isOpen,
  isAnalyzing,
  report,
  onViewReport,
}) => {
  const [analysisStep, setAnalysisStep] = useState(0);

  const steps = [
    'Parsing voice audio waves...',
    'Analyzing filler words and fluency rate...',
    'Aligning facial posture and eye contact ratio...',
    'Generating placement prediction score...',
  ];

  // Cycles through calculations text
  useEffect(() => {
    if (isOpen && isAnalyzing) {
      setAnalysisStep(0);
      const interval = setInterval(() => {
        setAnalysisStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 600);
      return () => clearInterval(interval);
    }
  }, [isOpen, isAnalyzing]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md rounded-3xl glass-panel border border-white/10 shadow-2xl overflow-hidden p-6 md:p-8"
          >
            {isAnalyzing ? (
              /* Scoring analysis loaders */
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-violet-500/10" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-cyan-400 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-extrabold text-lg text-white">AI Engine Scoring...</h3>
                  <p className="text-xs text-slate-400 font-mono h-4">
                    {steps[analysisStep]}
                  </p>
                </div>
              </div>
            ) : (
              /* Report Overview display */
              report && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-600/25">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-display font-extrabold text-xl text-white">Interview Complete!</h3>
                    <p className="text-xs text-slate-400">
                      Here is the summary of your {report.companyName} mock trial
                    </p>
                  </div>

                  {/* Primary overall score circle */}
                  <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/3 border border-white/5 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-1">OVERALL PERFORMANCE</span>
                    <div className="text-4xl font-display font-black text-white mb-2">{report.overallScore}%</div>
                    <ScoreBadge score={report.overallScore} size="sm" />
                  </div>

                  {/* Vectors progress */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-300">
                    <div className="p-3.5 rounded-xl border border-white/5 bg-slate-900/40 space-y-1">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Confidence</span>
                      <div className="text-base font-bold text-white">{report.confidenceScore}%</div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-white/5 bg-slate-900/40 space-y-1">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Technical</span>
                      <div className="text-base font-bold text-white">{report.technicalScore}%</div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="primary"
                      onClick={onViewReport}
                      icon={<ChevronRight className="w-4 h-4" />}
                      className="w-full py-3 rounded-xl font-bold shadow-lg"
                    >
                      View Detailed Feedback Report
                    </Button>
                  </div>
                </div>
              )
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
