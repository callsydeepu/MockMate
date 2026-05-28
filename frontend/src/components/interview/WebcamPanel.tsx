import React, { useRef } from 'react';
import Webcam from 'react-webcam';
import { VideoOff, ShieldCheck, Eye } from 'lucide-react';

interface WebcamPanelProps {
  enabled: boolean;
  confidenceScore?: number;
  eyeContactRatio?: number;
}

export const WebcamPanel: React.FC<WebcamPanelProps> = ({
  enabled,
  confidenceScore = 80,
  eyeContactRatio = 85,
}) => {
  const webcamRef = useRef<Webcam>(null);

  return (
    <div className="relative aspect-video w-full rounded-2xl border border-white/10 bg-slate-950 overflow-hidden shadow-2xl">
      {enabled ? (
        <>
          {/* Main Webcam Feed */}
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover scale-x-[-1]" // mirror effect
            videoConstraints={{ facingMode: 'user' }}
          />

          {/* Futuristic Face Mesh Overlays */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Corner Bracket Borders */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400/70" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400/70" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400/70" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400/70" />

            {/* Glowing Face Boundary Box */}
            <div className="absolute inset-x-[20%] inset-y-[15%] border border-cyan-400/40 rounded-[24px] shadow-[0_0_15px_rgba(6,182,212,0.15)] flex flex-col items-center justify-between p-4">
              <span className="text-[7px] font-mono text-cyan-400 bg-slate-950/80 px-1.5 py-0.5 rounded uppercase tracking-wider border border-cyan-400/20">
                AI Target locked
              </span>
              <div className="w-full flex justify-between items-end text-[7px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-1 rounded border border-cyan-400/10">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  CONFIDENCE: {confidenceScore}%
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  GAZE: {eyeContactRatio}%
                </span>
              </div>
            </div>

            {/* Scanning Radar Laser Line */}
            <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline" />
          </div>
        </>
      ) : (
        /* Video Disabled State */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-500 bg-slate-950/90 select-none">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center">
            <VideoOff className="w-6 h-6 text-slate-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Biometric camera offline
          </span>
        </div>
      )}
    </div>
  );
};
