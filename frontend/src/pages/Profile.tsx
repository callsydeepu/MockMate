import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User as UserIcon, Mail, Briefcase, Sparkles } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/auth/AuthContext';
import { MOCK_ACHIEVEMENTS } from '../data/mock/mockData';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  headline: z.string().min(5, 'Headline should describe your placement targets'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      headline: user?.headline || '',
    }
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    updateProfile({
      name: data.name,
      email: data.email,
      headline: data.headline,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900">Your Prep Profile</h1>
        <p className="text-slate-500 text-xs font-semibold">Update candidate credentials and track preparation achievement awards</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Avatar identity block (1 column) */}
        <Card className="lg:col-span-1 border-slate-200/50 text-center flex flex-col items-center gap-4 relative overflow-hidden py-8 shadow-sm">
          <div className="absolute top-[-10%] left-[-10%] w-24 h-24 bg-violet-600/10 blur-2xl rounded-full" />
          
          <div className="relative">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={user?.name}
              className="w-24 h-24 rounded-2xl object-cover bg-slate-100 border-2 border-violet-500/30 shadow-lg"
            />
            <span className="absolute bottom-1 right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center animate-pulse" title="Prep Mode Online" />
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 leading-tight">{user?.name}</h2>
            <p className="text-[10px] text-slate-600 font-bold">{user?.email}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/50 bg-slate-50/70 w-full text-left text-xs space-y-2">
            <div className="flex justify-between text-slate-600 font-semibold">
              <span>Member Joined:</span>
              <span className="text-slate-900 font-bold">{user?.joinedDate || 'Jan 2026'}</span>
            </div>
            <div className="flex justify-between text-slate-600 font-semibold">
              <span>Status:</span>
              <span className="text-sky-600 font-extrabold">Active Prep Cadet</span>
            </div>
          </div>
        </Card>

        {/* Right: editable profile form (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200/50 space-y-4 shadow-sm">
            <h3 className="text-xs uppercase font-black text-slate-700 tracking-wider">Update Details</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-750 flex items-center gap-1.5">
                    <UserIcon className="w-4 h-4 text-violet-500" /> Full Name
                  </label>
                  <input
                    type="text"
                    className={`px-4 py-2.5 text-sm glass-input text-slate-900 ${errors.name ? 'border-red-500/50' : ''}`}
                    {...register('name')}
                  />
                  {errors.name && <span className="text-[10px] text-red-600 font-bold">{errors.name.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-750 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-sky-600" /> Email Address
                  </label>
                  <input
                    type="email"
                    className={`px-4 py-2.5 text-sm glass-input text-slate-900 ${errors.email ? 'border-red-500/50' : ''}`}
                    {...register('email')}
                  />
                  {errors.email && <span className="text-[10px] text-red-600 font-bold">{errors.email.message}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-750 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-emerald-600" /> Target Prep Headline
                </label>
                <input
                  type="text"
                  className={`px-4 py-2.5 text-sm glass-input text-slate-900 ${errors.headline ? 'border-red-500/50' : ''}`}
                  {...register('headline')}
                />
                {errors.headline && <span className="text-[10px] text-red-600 font-bold">{errors.headline.message}</span>}
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="primary" type="submit" loading={isSubmitting} className="rounded-xl px-6 py-2.5 text-xs font-bold">
                  Save Settings
                </Button>
              </div>
            </form>
          </Card>

          {/* Achievement Trophy case */}
          <Card className="border-slate-200/50 space-y-4 shadow-sm">
            <div>
              <h3 className="text-xs uppercase font-black text-slate-700 tracking-wider">Unlocked Prep Badges</h3>
              <p className="text-[10px] text-slate-600 font-semibold">Milestones achieved during active mock interview cycles</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_ACHIEVEMENTS.map((ach) => (
                <div 
                  key={ach.id}
                  className={`p-3.5 rounded-xl border flex gap-3.5 items-center relative overflow-hidden transition-all ${
                    ach.unlocked 
                      ? 'border-violet-500/20 bg-violet-600/5 hover:border-violet-500/35' 
                      : 'border-slate-200/50 bg-slate-100/30 opacity-60'
                  }`}
                >
                  <div className="text-2xl flex-shrink-0 select-none">{ach.icon}</div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      {ach.title}
                      {ach.unlocked && <Sparkles className="w-3.5 h-3.5 text-violet-500" />}
                    </h4>
                    <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
                      {ach.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
