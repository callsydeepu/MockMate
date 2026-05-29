import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext';

// 1. AuthCard
export const AuthCard: React.FC<{ children: React.ReactNode; title: string; subtitle?: string }> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <Card className="glass-panel border-slate-200/60 shadow-lg relative overflow-hidden p-8">
      {/* Small glow decorative dots */}
      <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-violet-200/40 blur-3xl rounded-full" />
      <div className="absolute bottom-[-20%] left-[-20%] w-32 h-32 bg-sky-200/35 blur-3xl rounded-full" />
      
      <div className="text-center mb-6 relative z-10">
        <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-wide">{title}</h2>
        {subtitle && <p className="text-slate-500 text-xs mt-1.5 font-medium">{subtitle}</p>}
      </div>
      
      <div className="relative z-10">{children}</div>
    </Card>
  );
};

// 2. AuthInput (with forwarding ref to fit react-hook-form)
interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, icon, className = '', type = 'text', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-semibold text-slate-700">{label}</label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`w-full ${icon ? 'pl-10' : 'px-4'} pr-4 py-2.5 text-sm glass-input text-slate-900 ${
              error ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.15)]' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error && <FormErrorMessage message={error} />}
      </div>
    );
  }
);
AuthInput.displayName = 'AuthInput';

// 3. PasswordInput (with eye toggle and forwarding ref)
interface PasswordInputProps extends Omit<AuthInputProps, 'type' | 'icon'> {
  // Omit custom fields if necessary
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-semibold text-slate-700">{label}</label>
        <div className="relative">
          <input
            ref={ref}
            type={visible ? 'text' : 'password'}
            className={`w-full px-4 pr-10 py-2.5 text-sm glass-input text-slate-900 ${
              error ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.15)]' : ''
            } ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors"
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {error && <FormErrorMessage message={error} />}
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

// 4. FormErrorMessage
export const FormErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return <span className="text-[10px] text-red-650 font-bold pl-1">{message}</span>;
};

// 5. AuthButton
interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ children, loading, className = '', ...props }) => {
  return (
    <Button
      type="submit"
      variant="primary"
      loading={loading}
      className={`w-full py-2.5 text-sm font-semibold rounded-xl ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

// 6. SocialLoginButtons
export const SocialLoginButtons: React.FC = () => {
  const navigate = useNavigate();
  const { socialSignIn } = useAuth();

  const handleSocial = async (provider: 'google' | 'github' | 'linkedin') => {
    if (provider === 'google') {
      console.log('[DEBUG] Google OAuth flow - Redirecting user to backend Google OAuth initiation path');
      window.location.href = 'http://localhost:5000/api/auth/google';
      return;
    }
    if (provider === 'github') {
      console.log('[DEBUG] GitHub OAuth flow - Redirecting user to backend GitHub OAuth initiation path');
      window.location.href = 'http://localhost:5000/api/auth/github';
      return;
    }
    try {
      const ok = await socialSignIn(provider);
      if (ok) navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Social sign-in failed', err);
    }
  };

  return (
    <div className="w-full space-y-3">
      <Button
        type="button"
        variant="ghost"
        size="md"
        onClick={() => handleSocial('google')}
        className="w-full justify-center py-2.5 rounded-xl flex items-center gap-3 border border-slate-200 hover:bg-slate-50 text-slate-700"
      >
        <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path fill="#4285f4" d="M533.5 278.4c0-18.5-1.6-36.3-4.6-53.6H272v101.4h147.4c-6.4 34.4-25.8 63.6-54.9 83.1v68h88.6c51.9-47.8 81.4-118.1 81.4-198.9z"/>
          <path fill="#34a853" d="M272 544.3c73.6 0 135.5-24.5 180.7-66.7l-88.6-68c-24.6 16.5-56 26.2-92.1 26.2-70.8 0-130.8-47.8-152.2-112.1H28.6v70.5C73.6 485.9 167 544.3 272 544.3z"/>
          <path fill="#fbbc04" d="M119.8 323.7c-10.9-32.6-10.9-67.8 0-100.4V152.8H28.6c-39.3 77.4-39.3 169.5 0 246.9l91.2-76z"/>
          <path fill="#ea4335" d="M272 107.7c39.9 0 75.8 13.7 104 40.7l78-78C407.5 24.6 345.6 0 272 0 167 0 73.6 58.4 28.6 152.8l91.2 70.5C141.2 155.5 201.2 107.7 272 107.7z"/>
        </svg>
        <span className="text-sm font-semibold">Continue with Google</span>
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="md"
        onClick={() => handleSocial('github')}
        className="w-full justify-center py-2.5 rounded-xl flex items-center gap-3 border border-slate-200 hover:bg-slate-50 text-slate-700"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span className="text-sm font-semibold">Continue with GitHub</span>
      </Button>

      <div className="grid grid-cols-2 gap-3 w-full">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleSocial('google')}
          className="py-2.5 rounded-xl"
        >
          <span className="font-extrabold text-red-400 font-display">G</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleSocial('github')}
          className="py-2.5 rounded-xl"
        >
          <svg className="w-4 h-4 text-slate-700 fill-current" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </Button>
      </div>
    </div>
  );
};

// 7. LoadingSpinner
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };
  return (
    <div className="flex items-center justify-center p-4">
      <div className={`rounded-full border-t-violet-500 border-r-cyan-400 animate-spin ${sizeClasses[size]}`} />
    </div>
  );
};
