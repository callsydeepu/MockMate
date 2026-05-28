import React from 'react';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  size = 'md',
  className = '',
}) => {
  let styleClass = 'tag-neon-emerald'; // Default Excellent >= 85
  let label = 'Excellent';

  if (score < 70) {
    styleClass = 'tag-neon-pink';
    label = 'Needs Prep';
  } else if (score < 85) {
    styleClass = 'tag-neon-cyan';
    label = 'Proficient';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] font-bold rounded',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-md',
    lg: 'px-4 py-2 text-sm font-bold rounded-lg border-2',
  };

  return (
    <span className={`inline-flex items-center justify-center tracking-wide uppercase ${styleClass} ${sizeClasses[size]} ${className}`}>
      {score}% • {label}
    </span>
  );
};
