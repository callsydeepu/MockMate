import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  showLabel?: boolean;
  color?: 'default' | 'cyan' | 'purple' | 'emerald' | 'pink';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showLabel = false,
  color = 'default',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorGradients = {
    default: 'from-violet-500 to-indigo-500 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
    purple: 'from-purple-500 to-indigo-600 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
    cyan: 'from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]',
    emerald: 'from-emerald-500 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]',
    pink: 'from-pink-500 to-rose-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs text-slate-400 font-medium">
          <span>Progress</span>
          <span className="font-semibold text-white">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-slate-900/60 rounded-full overflow-hidden border border-white/5">
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out ${colorGradients[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
