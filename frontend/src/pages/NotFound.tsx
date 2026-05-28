import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Compass, ArrowLeft } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 mesh-grid relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background neon glows */}
      <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] bg-bg-glow-purple pointer-events-none rounded-full" />
      <div className="absolute bottom-[20%] right-[20%] w-[50%] h-[50%] bg-bg-glow-cyan pointer-events-none rounded-full" />

      <Card className="glass-panel max-w-md w-full border-white/10 text-center space-y-6 p-8 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-red-500 flex items-center justify-center mx-auto shadow-lg shadow-pink-600/20">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-display font-black text-white tracking-wider">404 ERROR</h1>
          <h2 className="text-sm font-bold text-pink-400 font-mono tracking-widest uppercase">Target pathway not found</h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            The telemetry coordinate you entered is offline. Check spelling or return back to the secure control panel.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={() => navigate('/dashboard')}
            icon={<Compass className="w-4 h-4" />}
            className="w-full py-3 rounded-xl font-bold"
          >
            Go to Dashboard
          </Button>
          
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-slate-500 hover:text-slate-300 font-semibold transition-colors flex items-center justify-center gap-1.5 py-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go back previous
          </button>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
