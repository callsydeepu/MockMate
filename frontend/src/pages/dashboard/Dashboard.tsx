import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  TrendingUp, 
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
  SCORE_DISTRIBUTION, 
  PERFORMANCE_TRENDS, 
  MOCK_RECOMMENDATIONS 
} from '../../data/mock/mockData';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { reports } = useInterview();
  const navigate = useNavigate();

  const totalInterviews = reports.length;
  
  const averageScore = Math.round(
    reports.reduce((sum, r) => sum + r.overallScore, 0) / (reports.length || 1)
  );

  const averageConfidence = Math.round(
    reports.reduce((sum, r) => sum + r.confidenceScore, 0) / (reports.length || 1)
  );

  const averageEyeContact = Math.round(
    reports.reduce((sum, r) => sum + r.eyeContactRatio, 0) / (reports.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* 1. WELCOME HERO & QUICK ACTIONS */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-cyan-400/5 blur-2xl -z-10 rounded-3xl" />
        <Card variant="elevated" size="lg" className="rounded-3xl">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="space-y-3 flex-1">
              <h1 className="text-2xl md:text-3xl font-display font-extrabold text-white flex items-center gap-3">
                Welcome back, {user?.name || 'Prep Cadet'} 
                <Sparkles className="w-6 h-6 text-violet-400 animate-pulse-glow" />
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your placement readiness index stands at <span className="badge-cyan px-2 py-1 inline-block">{averageScore}%</span>. Keep practicing to secure top offers!
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/interview')}
                icon={<Play className="w-5 h-5" />}
                className="flex-1 md:flex-none shadow-glow-lg"
              >
                Start Mock Interview
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/history')}
                className="w-full md:w-auto"
              >
                View History
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. ANALYTICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Completed interviews */}
        <Card variant="elevated" size="md" interactive glowColor="purple">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Interviews Completed</span>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-500/5 border border-violet-500/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-violet-400" />
              </div>
            </div>
            <div className="text-3xl font-display font-extrabold text-white">{totalInterviews}</div>
            <p className="text-[10px] text-emerald-400 font-semibold">Active practice tier</p>
          </div>
        </Card>

        {/* Card 2: Average Score */}
        <Card variant="elevated" size="md" interactive glowColor="cyan">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Average Score</span>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div className="text-3xl font-display font-extrabold text-white">{averageScore}%</div>
            <p className="text-[10px] text-cyan-400 font-semibold">Proficient standing</p>
          </div>
        </Card>

        {/* Card 3: Confidence Score */}
        <Card variant="elevated" size="md" interactive glowColor="emerald">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Avg. Confidence</span>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="text-3xl font-display font-extrabold text-white">{averageConfidence}%</div>
            <p className="text-[10px] text-emerald-400 font-semibold">+2.5% improvement</p>
          </div>
        </Card>

        {/* Card 4: Eye Contact */}
        <Card variant="elevated" size="md" interactive glowColor="pink">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Eye Contact Gaze</span>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-500/5 border border-fuchsia-500/30 flex items-center justify-center">
                <Eye className="w-5 h-5 text-fuchsia-400" />
              </div>
            </div>
            <div className="text-3xl font-display font-extrabold text-white">{averageEyeContact}%</div>
            <p className="text-[10px] text-fuchsia-400 font-semibold">Focus camera lens</p>
          </div>
        </Card>
      </div>

      {/* 3. CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend chart (2 columns on lg) */}
        <Card variant="elevated" size="lg" className="lg:col-span-2 space-y-5">
          <div className="space-y-1.5">
            <h3 className="text-sm uppercase font-bold text-white tracking-wider">Performance Trends</h3>
            <p className="text-xs text-slate-400">Overview of recent score metric improvements</p>
          </div>
          <div className="h-72 w-full -mx-6 px-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={PERFORMANCE_TRENDS}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} domain={[40, 100]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 15, 30, 0.95)', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff'
                  }} 
                />
                <Area type="monotone" dataKey="Overall" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOverall)" />
                <Area type="monotone" dataKey="Technical" stroke="#06b6d4" strokeWidth={2.0} fillOpacity={1} fill="url(#colorTech)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Score Vectors Distribution Radar (1 column on lg) */}
        <Card variant="elevated" size="lg" className="space-y-5">
          <div className="space-y-1.5">
            <h3 className="text-sm uppercase font-bold text-white tracking-wider">Score Vectors</h3>
            <p className="text-xs text-slate-400">Distribution across modules</p>
          </div>
          <div className="h-72 w-full flex items-center justify-center -mx-6 px-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={SCORE_DISTRIBUTION}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                <PolarRadiusAxis stroke="#475569" angle={30} domain={[0, 100]} fontSize={8} />
                <Radar 
                  name="Alex Mercer" 
                  dataKey="A" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6"
                  fillOpacity={0.25} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 4. RECENT INTERVIEWS & AI ROADMAP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Interviews list */}
        <Card className="space-y-4 border-white/5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider">Recent Activity</h3>
                <p className="text-[10px] text-slate-500">Your most recent completed mock trials</p>
              </div>
              <button 
                onClick={() => navigate('/history')}
                className="text-[10px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {reports.slice(0, 3).map((r) => (
                <div 
                  key={r.id}
                  className="p-3.5 rounded-xl border border-white/5 bg-slate-900/40 flex items-center justify-between hover:border-white/10 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{r.companyName}</span>
                      <span className="text-[9px] text-slate-400 font-mono">({r.role})</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">{r.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ScoreBadge score={r.overallScore} size="sm" />
                    <button 
                      onClick={() => navigate(`/reports`, { state: { reportId: r.id } })}
                      className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-white/5">
            <ProgressBar value={88} showLabel />
          </div>
        </Card>

        {/* AI Recommendations panel */}
        <Card className="space-y-4 border-white/5">
          <div>
            <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider">AI Coach Roadmap</h3>
            <p className="text-[10px] text-slate-500">Personalized pointers generated from biometrics history</p>
          </div>
          <div className="space-y-3.5">
            {MOCK_RECOMMENDATIONS.map((rec) => (
              <div 
                key={rec.id}
                className={`p-3.5 rounded-xl border flex gap-3.5 relative overflow-hidden ${
                  rec.priority === 'high' 
                    ? 'border-violet-500/20 bg-violet-600/5' 
                    : 'border-white/5 bg-slate-900/40'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  rec.priority === 'high' 
                    ? 'bg-violet-500/25 border border-violet-500/30 text-violet-400' 
                    : 'bg-white/5 border border-white/10 text-slate-400'
                }`}>
                  <Award className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    {rec.title}
                    {rec.priority === 'high' && (
                      <span className="text-[9px] font-black text-violet-400 px-1 py-0.5 rounded border border-violet-400/25 bg-violet-400/10">HIGH PRIORITY</span>
                    )}
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
