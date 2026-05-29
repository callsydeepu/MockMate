import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Eye, 
  Award, 
  Calendar, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ScoreBadge } from '../../components/common/ScoreBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useAuth } from '../../context/auth/AuthContext';
import { useInterview } from '../../context/interview/InterviewContext';
import { 
  MOCK_RECOMMENDATIONS 
} from '../../data/mock/mockData';
import { analyticsService } from '../../services/analyticsService';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { reports, refreshTrigger } = useInterview();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<{
    interviewsCompleted: number;
    reportsGenerated: number;
    averageScore: number;
    readinessRatio: number;
    averageCommunication: number;
    averageTechnical: number;
  } | null>(null);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [dashboardSummary, scoreTrends] = await Promise.all([
          analyticsService.getDashboardSummary(),
          analyticsService.getScoreTrends(),
        ]);
        setAnalytics(dashboardSummary);
        if (scoreTrends.length > 0) {
          setTrendData(
            scoreTrends.map((t, idx) => ({
              name: `Int. ${idx + 1}`,
              Overall: t.score,
              Technical: t.technical,
            }))
          );
        } else {
          setTrendData([]);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [refreshTrigger]);

  const totalInterviews = analytics ? analytics.interviewsCompleted : 0;
  const reportsGenerated = analytics ? analytics.reportsGenerated : 0;
  const averageScore = analytics ? analytics.averageScore : 0;
  const averageConfidence = analytics ? analytics.readinessRatio : 0;

  const radarData = analytics ? [
    { subject: 'Confidence', A: analytics.readinessRatio, fullMark: 100 },
    { subject: 'Communication', A: analytics.averageCommunication, fullMark: 100 },
    { subject: 'Technical', A: analytics.averageTechnical, fullMark: 100 },
    { subject: 'Overall', A: analytics.averageScore, fullMark: 100 },
  ] : [];

  return (
    <div className="space-y-6">
      {/* 1. WELCOME HERO & QUICK ACTIONS */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-sky-400/5 blur-2xl -z-10 rounded-3xl" />
        <Card variant="elevated" size="lg" className="rounded-3xl border-slate-200/60 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="space-y-3 flex-1">
              <h1 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 flex items-center gap-3">
                Welcome back, {user?.name || 'Prep Cadet'} 
                <Sparkles className="w-6 h-6 text-violet-500 animate-pulse-glow" />
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                Your placement readiness index stands at <span className="badge-cyan px-2 py-1 inline-block">{averageScore}%</span>. Keep practicing to secure top offers!
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/interview')}
                icon={<Play className="w-5 h-5 animate-pulse" />}
                className="flex-1 md:flex-none cursor-pointer"
              >
                Start Mock Interview
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/history')}
                className="w-full md:w-auto cursor-pointer"
              >
                View History
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. DYNAMIC CONTENT & EMPTY STATE */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-xs font-bold animate-pulse">
          Retrieving live biometrics & telemetry summary...
        </div>
      ) : totalInterviews === 0 ? (
        <Card variant="elevated" className="p-12 text-center border-slate-200/60 shadow-lg bg-white/70 backdrop-blur-md flex flex-col items-center justify-center space-y-4 rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-500 shadow-sm animate-pulse-glow">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-display font-extrabold text-slate-900">Start your first interview to unlock analytics.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-semibold leading-relaxed">
              MockMate X AI analyzes your vocal pacing, filler words, biometrics, and technical vocabulary in real-time.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/interview')}
            icon={<Play className="w-4 h-4 animate-pulse" />}
            className="cursor-pointer"
          >
            Start Your First Interview
          </Button>
        </Card>
      ) : (
        <>
          {/* ANALYTICS SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Interviews Taken */}
            <Card variant="elevated" size="md" interactive glowColor="purple" className="shadow-md">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">Interviews Taken</span>
                  <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-violet-600" />
                  </div>
                </div>
                <div className="text-3xl font-display font-extrabold text-slate-900">{totalInterviews}</div>
                <p className="text-[10px] text-violet-600 font-bold">Active practice tier</p>
              </div>
            </Card>

            {/* Card 2: Reports Generated */}
            <Card variant="elevated" size="md" interactive glowColor="cyan" className="shadow-md">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">Reports Generated</span>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                    <Award className="w-5 h-5 text-sky-600" />
                  </div>
                </div>
                <div className="text-3xl font-display font-extrabold text-slate-900">{reportsGenerated}</div>
                <p className="text-[10px] text-sky-600 font-bold">Processed evaluations</p>
              </div>
            </Card>

            {/* Card 3: Average Score */}
            <Card variant="elevated" size="md" interactive glowColor="emerald" className="shadow-md">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">Average Score</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div className="text-3xl font-display font-extrabold text-slate-900">{averageScore}%</div>
                <p className="text-[10px] text-emerald-650 font-bold">Proficient standing</p>
              </div>
            </Card>

            {/* Card 4: Avg. Confidence */}
            <Card variant="elevated" size="md" interactive glowColor="pink" className="shadow-md">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">Avg. Confidence</span>
                  <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-pink-600" />
                  </div>
                </div>
                <div className="text-3xl font-display font-extrabold text-slate-900">{averageConfidence}%</div>
                <p className="text-[10px] text-pink-600 font-bold">Speech posture index</p>
              </div>
            </Card>
          </div>

          {/* CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Trend chart (2 columns on lg) */}
            <Card variant="elevated" size="lg" className="lg:col-span-2 space-y-5 shadow-lg">
              <div className="space-y-1.5">
                <h3 className="text-sm uppercase font-bold text-slate-800 tracking-wider">Performance Trends</h3>
                <p className="text-xs text-slate-500 font-semibold">Overview of recent score metric improvements</p>
              </div>
              <div className="h-72 w-full -mx-6 px-6">
                {trendData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-500 font-bold text-xs">
                    Need more completed reports to display progression chart.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trendData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284c7" stopOpacity={0.12}/>
                          <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.6)" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} domain={[40, 100]} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          borderColor: 'rgba(226, 232, 240, 0.8)',
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: '#0f172a',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                        }} 
                      />
                      <Area type="monotone" dataKey="Overall" stroke="#7c3aed" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOverall)" />
                      <Area type="monotone" dataKey="Technical" stroke="#0284c7" strokeWidth={2.0} fillOpacity={1} fill="url(#colorTech)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            {/* Score Vectors Distribution Radar (1 column on lg) */}
            <Card variant="elevated" size="lg" className="space-y-5 shadow-lg">
              <div className="space-y-1.5">
                <h3 className="text-sm uppercase font-bold text-slate-800 tracking-wider">Score Vectors</h3>
                <p className="text-xs text-slate-500 font-semibold">Distribution across modules</p>
              </div>
              <div className="h-72 w-full flex items-center justify-center -mx-6 px-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="rgba(226, 232, 240, 0.8)" />
                    <PolarAngleAxis dataKey="subject" stroke="#475569" fontSize={9} />
                    <PolarRadiusAxis stroke="#94a3b8" angle={30} domain={[0, 100]} fontSize={8} />
                    <Radar 
                      name={user?.name || 'Prep Cadet'} 
                      dataKey="A" 
                      stroke="#7c3aed" 
                      fill="#7c3aed"
                      fillOpacity={0.15} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* RECENT INTERVIEWS & AI ROADMAP */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Interviews list */}
            <Card className="space-y-4 border-slate-200/60 shadow-lg flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs uppercase font-black text-slate-500 tracking-wider">Recent Activity</h3>
                    <p className="text-[10px] text-slate-500 font-semibold">Your most recent completed mock trials</p>
                  </div>
                  <button 
                    onClick={() => navigate('/history')}
                    className="text-[10px] font-bold text-sky-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {reports.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 font-bold text-xs">
                      No completed interviews yet. Finish your in-progress session to see activity!
                    </div>
                  ) : (
                    reports.slice(0, 3).map((r) => (
                      <div 
                        key={r.id}
                        className="p-3.5 rounded-xl border border-slate-100 bg-white/70 flex items-center justify-between hover:border-violet-500/20 hover:bg-white transition-all duration-300 shadow-sm"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{r.companyName}</span>
                            <span className="text-[9px] text-slate-500 font-mono">({r.role})</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium block">{r.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <ScoreBadge score={r.overallScore} size="sm" />
                          <button 
                            onClick={() => navigate(`/reports`, { state: { reportId: r.id } })}
                            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200/50">
                <ProgressBar value={reports.length > 0 ? 88 : 0} showLabel />
              </div>
            </Card>

            {/* AI Recommendations panel */}
            <Card className="space-y-4 border-slate-200/60 shadow-lg">
              <div>
                <h3 className="text-xs uppercase font-black text-slate-500 tracking-wider">AI Coach Roadmap</h3>
                <p className="text-[10px] text-slate-500 font-semibold">Personalized pointers generated from biometrics history</p>
              </div>
              <div className="space-y-3.5">
                {MOCK_RECOMMENDATIONS.map((rec) => (
                  <div 
                    key={rec.id}
                    className={`p-3.5 rounded-xl border flex gap-3.5 relative overflow-hidden transition-all duration-300 ${
                      rec.priority === 'high' 
                        ? 'border-violet-200 bg-violet-50/50 shadow-sm shadow-violet-500/5 hover:border-violet-300' 
                        : 'border-slate-100 bg-white/70 shadow-sm hover:border-violet-500/20 hover:bg-white'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      rec.priority === 'high' 
                        ? 'bg-violet-100 border border-violet-200 text-violet-600 shadow-sm' 
                        : 'bg-slate-50 border border-slate-200 text-slate-500 shadow-sm'
                    }`}>
                      <Award className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        {rec.title}
                        {rec.priority === 'high' && (
                          <span className="text-[9px] font-black text-violet-700 px-1.5 py-0.5 rounded border border-violet-200 bg-violet-100">HIGH PRIORITY</span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
