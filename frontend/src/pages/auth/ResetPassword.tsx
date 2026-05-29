import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/auth/AuthContext';
import { 
  AuthCard, 
  PasswordInput, 
  AuthButton 
} from '../../components/auth/AuthComponents';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' }
  });

  const onSubmit = async (data: ResetFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await resetPassword(token || '', data.password);
      if (success) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error in resetPassword request', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create New Password"
      subtitle="Complete your password reset by entering a secure new credential below."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <PasswordInput
          label="New Security Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <PasswordInput
          label="Confirm New Password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <AuthButton loading={isSubmitting}>
          Update Security Password
        </AuthButton>
      </form>

      <div className="mt-6 text-center text-xs">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-bold transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>
      </div>
    </AuthCard>
  );
};

export default ResetPassword;
