import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles,
  Video,
  Mic,
  Cpu,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Zap,
  TrendingUp
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Waveform } from '../components/common/Waveform';
import { MOCK_COMPANIES } from '../data/mock/mockData';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Animations configuration
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: any = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 80,
        damping: 15,
        mass: 0.9
      }
    }
  };

  const heroContainerVariants: any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.05 }
    }
  };

  const heroItemVariants: any = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 18,
        mass: 0.8
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] space-y-24 pb-20 overflow-hidden relative mesh-grid">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-violet-200/40 rounded-full blur-3xl opacity-50 animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-sky-200/35 rounded-full blur-3xl opacity-50 animate-pulse-glow" />
      </div>

      {/* 1. HERO SECTION */}
      <motion.section 
        variants={heroContainerVariants}
        initial="hidden"
        animate="visible"
        className="relative pt-12 md:pt-24 px-4 max-w-7xl mx-auto text-center space-y-10 z-10"
      >
        <motion.div
          variants={heroItemVariants}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full badge-violet"
        >
          <Sparkles className="w-4 h-4" />
          <span>Introducing Adaptive Multi-Sensor AI Coaching</span>
        </motion.div>

        <motion.h1
          variants={heroItemVariants}
          className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold leading-tight tracking-tight text-slate-900 max-w-5xl mx-auto"
        >
          Master Placement Interviews with{' '}
          <span className="text-gradient animate-pulse-glow">
            Adaptive AI Coach
          </span>
        </motion.h1>

        <motion.p
          variants={heroItemVariants}
          className="text-slate-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-semibold leading-relaxed"
        >
          MockMate X AI conducts dynamic mock reviews, analyzing voice pacing, eye contact, and confidence levels in real time to secure top software engineering offers.
        </motion.p>

        <motion.div
          variants={heroItemVariants}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2"
        >
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => navigate('/signup')}
            icon={<ChevronRight className="w-5 h-5" />}
          >
            Start Free Mock Session
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            icon={<Zap className="w-5 h-5" />}
          >
            See AI Demo
          </Button>
        </motion.div>

        {/* Floating tech panel preview card */}
        <motion.div
          variants={heroItemVariants}
          className="pt-12 max-w-5xl mx-auto relative group"
        >
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-tr from-violet-200/30 to-sky-200/30 blur-3xl -z-10 rounded-3xl" 
          />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-200/30 to-sky-200/30 blur-3xl -z-10 rounded-3xl" />
          <Card variant="glass" size="lg" className="rounded-3xl border-slate-200/60 shadow-lg">
            <div className="bg-white/80 rounded-2xl border border-slate-200/40 overflow-hidden shadow-inner">
              {/* Fake UI Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-slate-50/60 border-b border-slate-250/40">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/70 hover:bg-rose-500 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/70 hover:bg-amber-500 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70 hover:bg-emerald-500 transition-colors" />
                </div>
                <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">
                  biometric_feedback_v1.bin
                </div>
                <div className="w-4 h-4 rounded bg-sky-100 border border-sky-200" />
              </div>
              {/* Fake UI Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                <Card variant="elevated" size="md" interactive glowColor="cyan">
                  <div className="flex flex-col items-center justify-center gap-3 h-full">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center">
                      <Video className="w-6 h-6 text-sky-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Face Recognition</span>
                    <div className="w-full h-24 rounded-lg bg-slate-50 border border-slate-100 relative overflow-hidden flex items-center justify-center">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"
                        alt="Mock Face Tracking"
                        className="w-full h-full object-cover opacity-70"
                      />
                      <div className="absolute inset-0 border-2 border-sky-400/40 rounded-lg m-2 flex items-center justify-center">
                        <div className="text-[8px] font-mono text-sky-700 bg-white/95 px-2 py-1 rounded border border-sky-200">LOCKED: 91%</div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card variant="elevated" size="md" interactive glowColor="purple">
                  <div className="flex flex-col items-center justify-center gap-3 h-full">
                    <div className="w-10 h-10 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center">
                      <Mic className="w-6 h-6 text-violet-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Speech Pattern</span>
                    <div className="w-full h-24 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center justify-center px-4">
                      <Waveform isPlaying={true} barCount={18} height={40} />
                      <span className="text-[9px] font-mono text-violet-600 font-bold mt-2">132 WPM • Natural Pacing</span>
                    </div>
                  </div>
                </Card>

                <Card variant="elevated" size="md" interactive glowColor="pink">
                  <div className="flex flex-col justify-between gap-4 h-full">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                        <Cpu className="w-6 h-6 text-emerald-600" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">AI Tips</span>
                    </div>
                    <div className="text-[10px] text-slate-600 space-y-2.5 font-mono font-semibold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span>Eye contact: Optimal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-amber-500 flex-shrink-0" />
                        <span>"Uh" used: 0 times</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-sky-600 flex-shrink-0" />
                        <span>Confidence: Rising</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-violet-600 to-sky-500"
                        initial={{ width: 0 }}
                        animate={{ width: '84%' }}
                        transition={{ duration: 2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
          </motion.div>
        </motion.div>
      </motion.section>
      {/* 2. CORPORATE PREP LOGOS */}
      <section className="max-w-7xl mx-auto px-4 text-center space-y-8 z-10 relative">
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Simulate Interviews at Top Tier Companies
          </h3>
          <p className="text-sm text-slate-500 font-medium">Practice with questions from companies you aspire to join</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {MOCK_COMPANIES.map((c) => (
            <motion.div 
              key={c.name} 
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex items-center gap-3 p-3 rounded-lg hover-lift transition-all cursor-pointer group"
            >
              <span className={`text-3xl font-black ${c.color} font-display group-hover:drop-shadow-lg transition-all`}>{c.logo}</span>
              <span className="text-sm font-extrabold text-slate-600 group-hover:text-slate-900 tracking-wider uppercase transition-colors">{c.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. CORE FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-4 space-y-12 z-10 relative">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900">Multimodal AI Placement Training</h2>
          <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Traditional interview platforms only save static answers. MockMate X AI observes facial biometrics and speech patterns to help you master your presence.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants}>
            <Card variant="elevated" size="lg" interactive glowColor="cyan" className="h-full">
              <div className="space-y-5 flex flex-col h-full justify-between">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-100 to-sky-50/50 border border-sky-300/40 flex items-center justify-center group-hover:shadow-glow-cyan transition-all">
                  <Video className="w-7 h-7 text-sky-600" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900">Face & Gesture Tracker</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Calculates live gaze alignment ratios, nervousness indicators, and facial expressiveness during interviews.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sky-600 text-xs font-semibold pt-2 border-t border-slate-200/50">
                  <Sparkles className="w-3.5 h-3.5" />
                  Real-time feedback
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card variant="elevated" size="lg" interactive glowColor="purple" className="h-full">
              <div className="space-y-5 flex flex-col h-full justify-between">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-violet-50/50 border border-violet-300/40 flex items-center justify-center">
                  <Mic className="w-7 h-7 text-violet-600" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900">Speech Pattern Engine</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Counts filler words like "like", "basically", and "um" while analyzing words per minute and tone.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-violet-600 text-xs font-semibold pt-2 border-t border-slate-200/50">
                  <Zap className="w-3.5 h-3.5" />
                  Detailed analysis
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card variant="elevated" size="lg" interactive glowColor="pink" className="h-full">
              <div className="space-y-5 flex flex-col h-full justify-between">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fuchsia-100 to-fuchsia-50/50 border border-fuchsia-300/40 flex items-center justify-center">
                  <Cpu className="w-7 h-7 text-fuchsia-600" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900">Adaptive Follow-ups</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Questions adapt dynamically based on your answers, testing your technical boundaries in real-time.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-fuchsia-600 text-xs font-semibold pt-2 border-t border-slate-200/50">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Personalized
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* 4. DEMO INTERACTIVE PREVIEW */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        id="demo" 
        className="max-w-5xl mx-auto px-4 z-10 relative"
      >
        <Card variant="glass" size="lg" className="rounded-3xl border-slate-200/60 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="space-y-5 flex-1">
              <div className="inline-flex items-center gap-2 badge-cyan">
                <Zap className="w-3 h-3" />
                <span className="text-xs font-bold uppercase">Live Mock Simulation</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 leading-tight">
                Try Out the Interview Space
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Step directly into a fully simulated video workspace with an interactive AI interviewer. Test your mic, turn on your camera, and experience the complete dashboard immediately.
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/login')}
                icon={<ArrowUpRight className="w-4 h-4" />}
                className="mt-2"
              >
                Sign In to Start Now
              </Button>
            </div>
            <div className="w-full md:w-1/2 rounded-2xl border-2 border-slate-200/60 overflow-hidden shadow-sm bg-white">
              <video
                controls
                preload="metadata"
                className="w-full aspect-video rounded-2xl object-cover"
              >
                <source src="/demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Footer CTA */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        className="max-w-4xl mx-auto px-4 text-center space-y-8 z-10 relative pb-10"
      >
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900">
            Ready to ace your interviews?
          </h2>
          <p className="text-slate-600 text-base font-semibold">
            Join thousands of students preparing for their dream roles
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/signup')}
          >
            Get Started Free
          </Button>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
