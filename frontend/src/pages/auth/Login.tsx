import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail } from 'lucide-react';
import { useAuth } from '../../context/auth/AuthContext';
import { 
  AuthCard, 
  AuthInput, 
  PasswordInput, 
  AuthButton, 
  SocialLoginButtons 
} from '../../components/auth/AuthComponents';

// Zod Schema for Login
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await login(data.email, data.password, !!data.rememberMe);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error logging in', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard 
      title="Access Your Coach" 
      subtitle="Sign in to resume mock training and track placement metrics"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          label="Email Address"
          placeholder="yourname@university.edu"
          error={errors.email?.message}
          icon={<Mail className="w-4 h-4" />}
          {...register('email')}
        />

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="opacity-0 text-xs">spacer</span>
            <Link to="/forgot-password" className="text-[10px] text-violet-600 hover:text-violet-800 hover:underline font-semibold">
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            label="Security Password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            className="w-4 h-4 rounded border-slate-350 text-violet-600 focus:ring-violet-500/20 bg-white"
            {...register('rememberMe')}
          />
          <label htmlFor="rememberMe" className="ml-2 text-xs text-slate-600 font-medium select-none cursor-pointer">
            Remember me on this browser
          </label>
        </div>

        <AuthButton loading={isSubmitting}>
          Sign In
        </AuthButton>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-500 font-bold text-[10px] tracking-wider">OR CONTINUE WITH</span>
        </div>
      </div>

      <SocialLoginButtons />

      <div className="mt-6 text-center text-xs text-slate-500 font-semibold">
        New to MockMate?{' '}
        <Link to="/signup" className="text-violet-600 hover:text-violet-800 hover:underline font-bold">
          Create account
        </Link>
      </div>
    </AuthCard>
  );
};

export default Login;
