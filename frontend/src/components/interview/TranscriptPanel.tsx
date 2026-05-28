import React, { useEffect, useRef } from 'react';
import { Play, Sparkles } from 'lucide-react';

interface TranscriptPanelProps {
  transcript: string;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  transcript,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll transcript to bottom as text appends
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="glass-card flex-grow flex flex-col justify-between border-white/5 h-48 md:h-64">
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Vocal Transcription Feed</span>
        <span className="inline-flex items-center gap-1 text-[8px] font-bold text-cyan-400 border border-cyan-400/20 bg-cyan-400/5 px-2 py-0.5 rounded uppercase">
          AI parser active
        </span>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto py-3 text-xs text-slate-300 font-medium space-y-2 leading-relaxed scrollbar-thin"
      >
        {transcript.trim() === '' ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-1.5 select-none py-6">
            <Play className="w-6 h-6 opacity-30 animate-pulse text-cyan-400" />
            <span className="text-[10px] uppercase tracking-wider font-mono">Speak to write transcript</span>
          </div>
        ) : (
          <p className="whitespace-pre-line pl-1">{transcript}</p>
        )}
      </div>

      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-500 font-mono">
        <span>Press spacebar to trigger vocal checkpoints</span>
        <span className="flex items-center gap-1 text-violet-400">
          <Sparkles className="w-3 h-3 text-violet-400 animate-spin" /> NLP Connected
        </span>
      </div>
    </div>
  );
};
