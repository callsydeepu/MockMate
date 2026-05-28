import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, LogIn } from 'lucide-react';
import { Button } from '../components/common/Button';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const hasToken = !!localStorage.getItem('mockmate_token');

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg mesh-grid relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-bg-glow-purple pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-bg-glow-cyan pointer-events-none rounded-full" />

      {/* Floating glass navbar */}
      <header className="sticky top-0 z-50 px-4 py-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="glass-panel px-6 py-4 rounded-2xl flex items-center justify-between shadow-2xl">
          <Link to="/" className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <BrainCircuit className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <span className="font-display font-extrabold text-lg tracking-wider bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                MOCKMATE <span className="text-cyan-400 text-[11px] font-display font-black tracking-normal px-1 py-0.5 rounded border border-cyan-400/30 bg-cyan-400/10 align-middle">X AI</span>
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">AI Engine</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Success Stories</a>
          </nav>

          <div className="flex items-center gap-3">
            {hasToken ? (
              <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Link to="/login" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white font-semibold transition-colors px-4 py-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
                  Start Free
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main landing container */}
      <main className="flex-grow z-10">
        <Outlet />
      </main>

      {/* Futuristic footer */}
      <footer className="z-10 border-t border-white/5 bg-slate-950/80 backdrop-blur-md py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-base tracking-wider text-white">
                MOCKMATE X AI
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adaptive virtual mock interviews powered by multimodal biometric tracking and natural language processing.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Features</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Voice Analytics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Face Posture Scanner</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Confidence Predictor</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Adaptive Interviewer</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Company</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Aiming to bridge the gap between engineering classrooms and real placements.
            </p>
            <div className="text-xs text-cyan-400 font-semibold">
              © {new Date().getFullYear()} MockMate. Made for Students.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
