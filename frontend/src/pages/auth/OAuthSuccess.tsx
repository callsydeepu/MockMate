import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/auth/AuthContext';
import { ShieldCheck } from 'lucide-react';

export const OAuthSuccess: React.FC = () => {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const isAuthTriggered = useRef(false);
  const [statusMessage, setStatusMessage] = useState('Verifying details with Google...');

  useEffect(() => {
    // Avoid double execution in React StrictMode
    if (isAuthTriggered.current) return;
    isAuthTriggered.current = true;

    const parseAndLogin = async () => {
      try {
        console.log('[DEBUG] OAuthSuccess page - Parsing query parameters');
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
          console.error('[DEBUG] OAuthSuccess error - No token parameter found in callback URL');
          toast.error('Authentication failed: Missing token.');
          navigate('/login', { replace: true });
          return;
        }

        setStatusMessage('Syncing MockMate profile...');
        const success = await loginWithToken(token);

        if (success) {
          console.log('[DEBUG] OAuthSuccess - Login succeeded, redirecting to dashboard');
          toast.success('Successfully logged in with Google!', { id: 'oauth-success' });
          navigate('/dashboard', { replace: true });
        } else {
          console.error('[DEBUG] OAuthSuccess - Profile fetch returned false');
          toast.error('Failed to retrieve user profile.');
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error('[DEBUG] OAuthSuccess Exception:', err);
        toast.error('An error occurred during Google authentication.');
        navigate('/login', { replace: true });
      }
    };

    void parseAndLogin();
  }, [loginWithToken, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 relative z-10 text-center space-y-6 shadow-2xl backdrop-blur-md bg-slate-900/40">
        <div className="relative flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-bounce">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-display font-extrabold text-white tracking-wide">
            Google Authentication
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Please wait while we establish a secure session
          </p>
        </div>

        {/* Premium Spinner and Progress Indicator */}
        <div className="flex flex-col items-center space-y-4 pt-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/10" />
            <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-cyan-400 animate-spin" />
          </div>
          <span className="text-xs text-slate-300 font-semibold animate-pulse tracking-wide">
            {statusMessage}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OAuthSuccess;
