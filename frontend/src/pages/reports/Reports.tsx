import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, ChevronLeft, Calendar, FileText, ShieldCheck, Speech, AlertCircle } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ScoreBadge } from '../../components/common/ScoreBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { interviewService } from '../../services/interviewService';
import { reportService, type ReportViewModel } from '../../services/reportService';
import { toast } from 'react-hot-toast';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<ReportViewModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await reportService.getReports();
      setReports(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to load reports. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  // Retrieve report ID from location state if redirected, or default to latest report
  const stateReportId = location.state?.reportId;
  const activeReport = reports.find(r => r.id === stateReportId) || reports[0];

  const handleDownload = async () => {
    if (!activeReport) return;
    console.log(`[DEBUG] button click - Downloading PDF for report: ${activeReport.id}`);
    setIsDownloading(true);
    const toastId = toast.loading('Generating and downloading your PDF report...');
    try {
      await interviewService.downloadReportPDF(activeReport.id);
      console.log('[DEBUG] download success - PDF downloaded and saved locally');
      toast.success('Report PDF downloaded successfully!', { id: toastId });
    } catch (err) {
      console.error('[DEBUG] download failure - Error occurred during PDF download:', err);
      toast.error('Failed to download PDF report. Please try again.', { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-4">
        <h2 className="text-xl font-display font-extrabold text-slate-900">Loading Reports</h2>
        <p className="text-slate-500 text-xs font-semibold">Fetching your latest interview analytics from the server...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-4">
        <h2 className="text-xl font-display font-extrabold text-slate-900">Could Not Load Reports</h2>
        <p className="text-slate-500 text-xs font-semibold">{error}</p>
        <Button variant="primary" onClick={() => void loadReports()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!activeReport) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-4">
        <h2 className="text-xl font-display font-extrabold text-slate-900">No Reports Found</h2>
        <p className="text-slate-500 text-xs font-semibold">You have not completed any interviews yet. Go to the Interview Room to get started.</p>
        <Button variant="primary" onClick={() => navigate('/interview')}>
          Go to Interview Room
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button and Download bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={() => navigate('/history')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to history logs
        </button>

        <Button
          variant="secondary"
          size="sm"
          loading={isDownloading}
          onClick={handleDownload}
          icon={<Download className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Download PDF Report
        </Button>
      </div>

      {/* 1. REPORT IDENTITY BLOCK */}
      <div className="p-6 rounded-2xl glass-panel relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute top-[-10%] right-[-10%] w-36 h-36 bg-cyan-400/5 blur-2xl rounded-full" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-600 uppercase font-mono tracking-wider">Mock Result</span>
            <span className="text-[10px] text-slate-400 font-bold">•</span>
            <span className="text-slate-500 text-xs font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> {activeReport.dateLabel}
            </span>
          </div>
          <h1 className="text-lg md:text-xl font-display font-extrabold text-slate-900">
            {activeReport.companyName} Sim: {activeReport.role}
          </h1>
          <p className="text-slate-500 text-[10px] font-mono">REPORT IDENTIFIER: {activeReport.id}</p>
          <p className="text-slate-500 text-[10px] font-mono">LAST UPDATED: {new Date(activeReport.updatedAt).toLocaleString('en-US')}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="badge-violet">
              {activeReport.performanceLevel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Assessment:</span>
          <ScoreBadge score={activeReport.overallScore} size="sm" />
        </div>
      </div>

      {/* 2. CORE SCORE SPLITS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Score Circle */}
        <Card className="md:col-span-1 border-slate-200/50 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 shadow-sm">
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-2">Overall Score</span>
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Simple circular background progress using Tailwind border classes */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
            <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-cyan-400 animate-pulse" />
            <span className="text-3xl font-display font-black text-slate-900">{activeReport.overallScore}%</span>
          </div>
          <span className="text-[10px] text-slate-500 font-bold mt-4">Simulated Rating</span>
        </Card>

        {/* Breakdown progress meters */}
        <Card className="md:col-span-3 border-slate-200/50 space-y-4">
          <h3 className="text-xs uppercase font-black text-slate-500 tracking-wider">Metrics Breakdown</h3>
          
          <div className="space-y-3.5">
            {/* Confidence */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-sky-600" /> Biometrics & Confidence</span>
                <span className="text-sky-600 font-bold">{activeReport.confidenceScore}%</span>
              </div>
              <ProgressBar value={activeReport.confidenceScore} color="cyan" />
            </div>

            {/* Communication */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5"><Speech className="w-4 h-4 text-violet-600" /> Speech & Vocal Pacing</span>
                <span className="text-violet-600 font-bold">{activeReport.communicationScore}%</span>
              </div>
              <ProgressBar value={activeReport.communicationScore} color="purple" />
            </div>

            {/* Technical */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-emerald-600" /> Answer Accuracy & STAR Method</span>
                <span className="text-emerald-600 font-bold">{activeReport.technicalScore}%</span>
              </div>
              <ProgressBar value={activeReport.technicalScore} color="emerald" />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. VERBAL SUMMARY SUGGESTIONS */}
      <Card className="border-slate-200/50 space-y-4 shadow-sm">
        <div>
          <h3 className="text-xs uppercase font-black text-slate-500 tracking-wider">Strengths, Weaknesses & AI Feedback</h3>
          <p className="text-[10px] text-slate-500 font-semibold">Personalized summary generated from your completed interview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
          <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/10 space-y-2">
            <span className="text-[9px] uppercase font-bold text-violet-600 block tracking-wider">Strengths</span>
            <div className="space-y-1">
              {activeReport.strengths.length > 0 ? (
                activeReport.strengths.map((strength, idx) => (
                  <p key={idx}>• {strength}</p>
                ))
              ) : (
                <p>• No strengths captured yet.</p>
              )}
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/10 space-y-2">
            <span className="text-[9px] uppercase font-bold text-sky-600 block tracking-wider">Weaknesses</span>
            <div className="space-y-1">
              {activeReport.weaknesses.length > 0 ? (
                activeReport.weaknesses.map((weakness, idx) => (
                  <p key={idx}>• {weakness}</p>
                ))
              ) : (
                <p>• No weaknesses captured yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations list */}
        <div className="space-y-2 text-xs text-slate-700 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-900">Overall Feedback:</h4>
          <p className="leading-relaxed text-slate-500 font-medium">{activeReport.feedback || 'No feedback available yet.'}</p>
        </div>
      </Card>

      {/* 4. TRANSCRIPT & QA BREAKDOWN */}
      <Card className="border-slate-200/50 space-y-4 shadow-sm">
        <div>
          <h3 className="text-xs uppercase font-black text-slate-500 tracking-wider">Question & Transcript Breakdown</h3>
          <p className="text-[10px] text-slate-500 font-semibold">Examine specific question responses alongside structural coach analysis</p>
        </div>

        <div className="space-y-4">
          {activeReport.transcriptSummary.length > 0 ? activeReport.transcriptSummary.map((item, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl border border-slate-200/50 bg-slate-50/50 space-y-4 relative overflow-hidden"
            >
              {/* Question card header */}
              <div className="flex justify-between items-start gap-4 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-mono font-bold block uppercase">Question 0{idx + 1}</span>
                  <h4 className="text-xs font-bold text-slate-900">{item.question}</h4>
                </div>
                <ScoreBadge score={item.score} size="sm" />
              </div>

              {/* User transcript */}
              <div className="space-y-1">
                <span className="text-[9px] text-sky-600 uppercase font-mono font-bold block">Recorded Response Transcript</span>
                <p className="text-xs text-slate-700 italic leading-relaxed bg-white p-3 rounded-lg border border-slate-200/55">
                  "{item.answer}"
                </p>
              </div>

              {/* AI critique */}
              <div className="p-3.5 rounded-xl border border-violet-500/15 bg-violet-50 flex gap-2.5 items-start text-xs font-semibold text-slate-700">
                <AlertCircle className="w-4.5 h-4.5 text-violet-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[9px] text-violet-600 block font-mono font-bold uppercase">AI Coach Critique</span>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {item.feedback}
                  </p>
                </div>
              </div>

              {/* Ideal / expected answer */}
              {item.expectedAnswer && (
                <div className="p-4 rounded-xl border border-emerald-500/15 bg-emerald-50 text-xs text-slate-700 relative overflow-hidden transition-all duration-300 hover:border-emerald-500/20">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-xl rounded-full" />
                  <span className="text-[9px] text-emerald-600 block font-mono font-bold uppercase mb-1 tracking-wider">
                    Expected / Ideal Response
                  </span>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    "{item.expectedAnswer}"
                  </p>
                </div>
              )}
            </div>
          )) : (
            <div className="p-5 rounded-2xl border border-slate-200/50 bg-slate-50/50 space-y-2">
              <h4 className="text-xs font-bold text-slate-900">No Transcript Items Available</h4>
              <p className="text-xs text-slate-500">This report does not have question-level transcript data yet.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Reports;
