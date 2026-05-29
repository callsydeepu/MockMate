import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Waveform } from '../common/Waveform';

interface MicrophonePanelProps {
  enabled: boolean;
  isRecording: boolean;
}

export const MicrophonePanel: React.FC<MicrophonePanelProps> = ({
  enabled,
  isRecording,
}) => {
  return (
    <div className="glass-card p-4 flex items-center justify-between border-slate-200/50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
          enabled 
            ? 'bg-violet-600/10 border-violet-500/20 text-violet-600' 
            : 'bg-red-500/10 border-red-500/20 text-red-600'
        }`}>
          {enabled ? <Mic className="w-4.5 h-4.5" /> : <MicOff className="w-4.5 h-4.5" />}
        </div>
        <div>
          <span className="text-xs font-bold text-slate-900 block">
            {enabled ? 'Microphone Active' : 'Microphone Muted'}
          </span>
          <span className="text-[10px] text-slate-500 block">
            {enabled && isRecording ? 'Processing audio streams' : 'Vocal parser offline'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {enabled && isRecording ? (
          <div className="flex items-center gap-2 bg-white/75 px-3 py-1.5 rounded-lg border border-slate-200/50">
            <Waveform isPlaying={isRecording} barCount={10} height={20} color="cyan" />
            <span className="text-[9px] font-mono text-sky-600 font-bold uppercase tracking-wider animate-pulse">
              LIVE
            </span>
          </div>
        ) : (
          <span className="text-[9px] font-mono text-slate-600 font-semibold">Muted</span>
        )}
      </div>
    </div>
  );
};
