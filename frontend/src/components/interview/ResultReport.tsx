// src/components/interview/ResultReport.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, BarChart2, Star } from 'lucide-react';
import type { InterviewReport } from '../../context/interview/InterviewContext';

interface ResultReportProps {
  report: InterviewReport;
}

export const ResultReport: React.FC<ResultReportProps> = ({ report }) => {
  return (
    <motion.div
      className="bg-slate-900/95 backdrop-blur-md rounded-xl p-8 max-w-4xl w-full text-gray-100 shadow-2xl border border-violet-500/30"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Star className="w-6 h-6 text-yellow-400 mr-2" />
            Interview Analysis – {report.companyName}
          </h2>
          <p className="text-sm text-slate-400 mt-1">Session standard: <span className="text-white font-semibold">{report.performanceLevel || 'Beginner'}</span></p>
          <div className="flex flex-wrap gap-2 mt-2">
            {(report.performanceTags || []).map((tag, idx) => (
              <span key={idx} className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-200 border border-white/10">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button onClick={() => window.location.reload()} className="p-2 rounded-full hover:bg-violet-700 transition">
          <CheckCircle className="w-5 h-5 text-green-400" />
        </button>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <ScoreCard title="Overall" value={report.overallScore} icon={<CheckCircle className="w-5 h-5 text-green-400" />} />
        <ScoreCard title="Confidence" value={report.confidenceScore} icon={<BarChart2 className="w-5 h-5 text-indigo-400" />} />
        <ScoreCard title="Communication" value={report.communicationScore} icon={<BarChart2 className="w-5 h-5 text-indigo-400" />} />
        <ScoreCard title="Technical" value={report.technicalScore} icon={<BarChart2 className="w-5 h-5 text-indigo-400" />} />
      </div>

      {/* Transcript Summary */}
      <h3 className="text-lg font-medium mb-2">Question Summary</h3>
      <div className="space-y-4 max-h-60 overflow-y-auto mb-6">
        {report.transcriptSummary.map((item, idx) => (
          <div key={idx} className="border-b border-gray-700 pb-2">
            <p className="font-medium">Q: {item.question}</p>
            <p className="italic text-sm opacity-80">Your Answer: {item.answer}</p>
            <p className="text-sm">Feedback: {item.feedback}</p>
            <p className="text-sm font-semibold text-violet-200">Score: {item.score}%</p>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      <h3 className="text-lg font-medium mb-2">Improvement Suggestions</h3>
      <ul className="list-disc list-inside space-y-1 mb-4">
        {report.suggestions.map((s, i) => (
          <li key={i} className="text-sm opacity-90">
            {s}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

interface ScoreCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, value, icon }) => (
  <div className="flex items-center bg-slate-800 rounded p-3">
    <div className="mr-3">{icon}</div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-xl font-bold">{value}%</p>
    </div>
  </div>
);
