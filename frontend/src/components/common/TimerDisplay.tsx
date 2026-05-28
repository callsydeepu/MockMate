import React from 'react';
import { Timer } from 'lucide-react';

interface TimerDisplayProps {
  seconds: number;
  warnThreshold?: number; // threshold in seconds to turn red
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  seconds,
  warnThreshold = 30,
}) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;

  const isLow = seconds <= warnThreshold;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm backdrop-filter backdrop-blur-sm transition-all duration-300 ${
        isLow
          ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
          : 'bg-slate-900/60 border-white/10 text-slate-300'
      }`}
    >
      <Timer className={`w-4 h-4 ${isLow ? 'text-red-400' : 'text-cyan-400'}`} />
      <span>{formattedTime}</span>
    </div>
  );
};
