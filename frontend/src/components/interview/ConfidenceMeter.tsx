import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';

interface ConfidenceMeterProps {
  score: number;
  history: number[];
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  score,
  history,
}) => {
  // Convert history array to object array for Recharts
  const chartData = history.map((val, idx) => ({ time: idx, score: val }));

  return (
    <Card className="border-white/5 space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Real-time Confidence</span>
          <span className="text-[8px] text-slate-500 font-mono">Facial expression & posture scan</span>
        </div>
        <span className="text-xl font-display font-black text-cyan-400 text-glow-cyan">
          {score}%
        </span>
      </div>

      {/* Main Gauge Progress */}
      <div className="space-y-1.5">
        <ProgressBar value={score} color="cyan" />
        <div className="flex justify-between text-[9px] text-slate-500 font-mono">
          <span>Tense</span>
          <span>Steady</span>
          <span>Poised</span>
        </div>
      </div>

      {/* Small fluctuation line sparkline */}
      <div className="h-12 w-full bg-slate-950/40 rounded-xl overflow-hidden border border-white/5">
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="meterGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#06b6d4" 
                strokeWidth={1.5} 
                fillOpacity={1} 
                fill="url(#meterGlow)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-[8px] font-mono text-slate-600">
            Awaiting tracking telemetry...
          </div>
        )}
      </div>
    </Card>
  );
};
