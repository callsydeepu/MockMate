import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, User } from 'lucide-react';
import { useAuth } from '../../context/auth/AuthContext';
import { 
  AuthCard, 
  AuthInput, 
  PasswordInput, 
  AuthButton, 
  SocialLoginButtons 
} from '../../components/auth/AuthComponents';

// Zod Schema for Signup
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  agreeTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    }
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await signup(data.name, data.email, data.password);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error signing up', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard 
      title="Create Account" 
      subtitle="Sign up in seconds to unlock adaptive AI interviews"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          label="Your Full Name"
          placeholder="Alex Mercer"
          error={errors.name?.message}
          icon={<User className="w-4 h-4" />}
          {...register('name')}
        />

        <AuthInput
          label="College / Personal Email"
          placeholder="yourname@university.edu"
          error={errors.email?.message}
          icon={<Mail className="w-4 h-4" />}
          {...register('email')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PasswordInput
            label="Security Password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-start">
            <input
              id="agreeTerms"
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded bg-slate-900 border-white/10 text-violet-600 focus:ring-violet-500/50"
              {...register('agreeTerms')}
            />
            <label htmlFor="agreeTerms" className="ml-2 text-xs text-slate-400 select-none cursor-pointer">
              I agree to the MockMate{' '}
              <a href="#" className="text-cyan-400 hover:underline">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="#" className="text-cyan-400 hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.agreeTerms && (
            <span className="text-[10px] text-red-400 font-medium block pl-1">
              {errors.agreeTerms.message}
            </span>
          )}
        </div>

        <AuthButton loading={isSubmitting}>
          Unlock AI Mock Room
        </AuthButton>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-950 px-3 text-slate-500 font-bold text-[10px] tracking-wider">Or sign up with</span>
        </div>
      </div>

      <SocialLoginButtons />

      <div className="mt-6 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-cyan-400 hover:underline font-semibold">
          Sign In
        </Link>
      </div>
    </AuthCard>
  );
};

export default Signup;
