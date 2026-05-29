import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Card } from '../../components/common/Card';
import { ScoreBadge } from '../../components/common/ScoreBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { analyticsService } from '../../services/analyticsService';
import { 
  PERFORMANCE_TRENDS, 
  FILLER_WORDS_HISTORY, 
  EYE_CONTACT_TRENDS 
} from '../../data/mock/mockData';

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    interviewsCompleted: 0,
    averageScore: 0,
    readinessRatio: 0,
    fillerWordsAverage: 0,
  });
  const [trendData, setTrendData] = useState(PERFORMANCE_TRENDS);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [dashboardSummary, scoreTrends] = await Promise.all([
          analyticsService.getDashboardSummary(),
          analyticsService.getScoreTrends(),
        ]);

        setSummary(dashboardSummary);

        if (scoreTrends.length > 0) {
          setTrendData(
            scoreTrends.map((trend) => ({
              name: trend.date,
              Overall: trend.score,
              Confidence: trend.confidence,
              Technical: trend.technical,
              Communication: trend.score,
            }))
          );
        }
      } catch {
        // Keep existing static mock analytics if backend data is unavailable.
      } finally {
        setLoading(false);
      }
    };

    void loadAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900">Biometric & speech Analytics</h1>
        <p className="text-slate-500 text-xs font-semibold">In-depth statistical reporting based on multi-sensor mock interviews</p>
      </div>

      {/* 1. SCORE PROGRESSION AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4 border-slate-200/50 shadow-lg">
          <div>
            <h3 className="text-xs uppercase font-black text-slate-500 tracking-wider">Historical Progression</h3>
            <p className="text-[10px] text-slate-500 font-semibold">Longitudinal review of key interview domains</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.6)" />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} domain={[50, 100]} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: 'rgba(226, 232, 240, 0.8)', color: '#0f172a', borderRadius: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="Overall" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Technical" stroke="#0284c7" strokeWidth={2} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="Communication" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Dynamic speech metrics progress */}
        <Card className="space-y-4 border-slate-200/50 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs uppercase font-black text-slate-500 tracking-wider">Fluency Parameters</h3>
              <p className="text-[10px] text-slate-500 font-semibold">Live vocal analysis averages</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <span>Vocal Pacing (Words/Min)</span>
                  <span className="text-sky-600 font-bold">{summary.interviewsCompleted > 0 ? 130 : 0} WPM</span>
                </div>
                <ProgressBar value={summary.readinessRatio || 0} color="cyan" />
                <span className="text-[9px] text-slate-500 block font-medium">Perfect pacing is 130-150 words per minute.</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <span>Filler words frequency</span>
                  <span className="text-violet-650 font-bold">{loading ? 'Loading...' : 'Live'}</span>
                </div>
                <ProgressBar value={Math.max(0, 100 - summary.fillerWordsAverage * 10)} color="purple" />
                <span className="text-[9px] text-slate-500 block font-medium">Average filler words: {summary.fillerWordsAverage.toFixed(1)} per interview.</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <span>Technical Vocabulary</span>
                  <span className="text-emerald-650 font-bold">{summary.averageScore >= 80 ? 'Advanced' : 'Growing'}</span>
                </div>
                <ProgressBar value={summary.averageScore || 0} color="emerald" />
                <span className="text-[9px] text-slate-500 block font-medium">Incorporates strong vocabulary like O(N), Hash Maps.</span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-200/50 flex items-center justify-between">
            <span className="text-slate-600 text-xs font-bold">Vocal Score Rating</span>
            <ScoreBadge score={summary.averageScore || 0} size="sm" />
          </div>
        </Card>
      </div>

      {/* 2. BAR CHART FILLER WORDS & EYE CONTACT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Filler Words Histogram */}
        <Card className="space-y-4 border-slate-200/50 shadow-lg">
          <div>
            <h3 className="text-xs uppercase font-black text-slate-500 tracking-wider">Filler word logs</h3>
            <p className="text-[10px] text-slate-500 font-semibold">Frequency counts of vocal crumbs per mock trial</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FILLER_WORDS_HISTORY} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.6)" />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: 'rgba(226, 232, 240, 0.8)', color: '#0f172a', borderRadius: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Um" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Like" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Basically" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Eye Contact Area tracker */}
        <Card className="space-y-4 border-slate-200/50 shadow-lg">
          <div>
            <h3 className="text-xs uppercase font-black text-slate-500 tracking-wider">Eye gaze stability</h3>
            <p className="text-[10px] text-slate-500 font-semibold">Camera alignment ratios over recent sessions</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EYE_CONTACT_TRENDS} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGaze" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.6)" />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} domain={[50, 100]} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: 'rgba(226, 232, 240, 0.8)', color: '#0f172a', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="ratio" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGaze)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 3. STRENGTHS & WEAKNESSES BOXES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-emerald-200 bg-emerald-50/30 shadow-sm shadow-emerald-500/5 space-y-4">
          <div>
            <h4 className="text-xs uppercase font-black text-emerald-800 tracking-wider font-extrabold">Verified Strengths</h4>
            <p className="text-[10px] text-emerald-700 font-semibold">Key metrics exceeding target values</p>
          </div>
          <div className="space-y-2 text-xs text-slate-700 font-semibold leading-relaxed">
            <p className="flex items-center gap-2"><span className="text-emerald-600">✓</span> **Structured behavioral answers**: Demonstrates clear STAR logic flow.</p>
            <p className="flex items-center gap-2"><span className="text-emerald-600">✓</span> **Excellent camera stability**: Maintained high focus over all technical trials.</p>
            <p className="flex items-center gap-2"><span className="text-emerald-600">✓</span> **Vocabulary breadth**: Effectively explains asymptotic terms and structures.</p>
          </div>
        </Card>

        <Card className="border border-rose-200 bg-rose-50/30 shadow-sm shadow-pink-500/5 space-y-4">
          <div>
            <h4 className="text-xs uppercase font-black text-rose-800 tracking-wider font-extrabold">Active Growth Areas</h4>
            <p className="text-[10px] text-rose-700 font-semibold">Areas requiring focused practice rounds</p>
          </div>
          <div className="space-y-2 text-xs text-slate-700 font-semibold leading-relaxed">
            <p className="flex items-center gap-2"><span className="text-pink-600">⚡</span> **Coding spatial constraints**: Remember to discuss memory complexities.</p>
            <p className="flex items-center gap-2"><span className="text-pink-600">⚡</span> **Speech pacing in Tech tasks**: Slow down vocabulary speed slightly when nervous.</p>
            <p className="flex items-center gap-2"><span className="text-pink-600">⚡</span> **Initial filler counts**: Reduces using "like" when describing arrays.</p>
          </div>
        </Card>
      </div>
      </div>
  );
};

export default Analytics;
