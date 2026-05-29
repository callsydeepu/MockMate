import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/auth/AuthContext';
import { 
  AuthCard, 
  AuthInput, 
  AuthButton 
} from '../../components/auth/AuthComponents';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

type ForgotFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await forgotPassword(data.email);
      if (success) {
        // Move to reset password simulation page
        navigate('/reset-password');
      }
    } catch (err) {
      console.error('Error in forgotPassword request', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter your registration email, and we will send a secure reset link."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          label="Account Email Address"
          placeholder="yourname@university.edu"
          error={errors.email?.message}
          icon={<Mail className="w-4 h-4" />}
          {...register('email')}
        />

        <AuthButton loading={isSubmitting}>
          Send Reset Link
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

export default ForgotPassword;
