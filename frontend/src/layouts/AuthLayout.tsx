import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg mesh-grid relative overflow-hidden flex flex-col justify-center items-center p-4">
      {/* Background glow effects */}
      <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-bg-glow-purple pointer-events-none rounded-full" />
      <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-bg-glow-cyan pointer-events-none rounded-full" />

      {/* Floating brand header */}
      <div className="z-10 mb-8 flex flex-col items-center">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-extrabold text-2xl tracking-wider text-white">
            MOCKMATE <span className="text-cyan-400 text-xs font-black px-1.5 py-0.5 rounded border border-cyan-400/30 bg-cyan-400/10 align-middle">X AI</span>
          </span>
        </Link>
        <p className="text-slate-400 text-xs mt-2 text-center">
          Adaptive Virtual Interview Coach & Career Placement Catalyst
        </p>
      </div>

      {/* Container cards for authentication views */}
      <div className="w-full max-w-md z-10">
        <Outlet />
      </div>

      <div className="z-10 mt-8 text-center text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-300 transition-colors">
          ← Back to landing page
        </Link>
      </div>
    </div>
  );
};
