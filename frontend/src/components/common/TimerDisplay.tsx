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
          ? 'bg-red-50 border-red-200 text-red-650 animate-pulse'
          : 'bg-white/80 border-slate-200/60 text-slate-700'
      }`}
    >
      <Timer className={`w-4 h-4 ${isLow ? 'text-red-600' : 'text-sky-600'}`} />
      <span>{formattedTime}</span>
    </div>
  );
};
