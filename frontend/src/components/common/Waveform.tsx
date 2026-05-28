import React from 'react';
import { motion } from 'framer-motion';

interface WaveformProps {
  isPlaying: boolean;
  barCount?: number;
  color?: 'purple' | 'cyan' | 'mixed';
  height?: number;
}

export const Waveform: React.FC<WaveformProps> = ({
  isPlaying,
  barCount = 12,
  color = 'mixed',
  height = 32,
}) => {
  const bars = Array.from({ length: barCount });

  const getBarColor = (index: number) => {
    if (color === 'purple') return 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]';
    if (color === 'cyan') return 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]';
    // Mixed gradient
    return index % 2 === 0 
      ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
      : 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.4)]';
  };

  return (
    <div 
      className="flex items-center gap-[3px]"
      style={{ height: `${height}px` }}
    >
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className={`w-[3px] rounded-full ${getBarColor(i)}`}
          style={{ height: '20%', originY: 0.5 }}
          animate={
            isPlaying
              ? {
                  scaleY: [1, 2.5, 0.7, 3, 1.2, 2.2, 0.5, 1.8, 1],
                  transition: {
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: 'reverse' as const,
                    delay: i * 0.08,
                    ease: 'easeInOut',
                  },
                }
              : { scaleY: 1 }
          }
        />
      ))}
    </div>
  );
};
