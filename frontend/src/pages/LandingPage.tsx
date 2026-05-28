import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, easeOut } from 'framer-motion';
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
      transition: { duration: 0.8, ease: easeOut }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 space-y-24 pb-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl opacity-50" />
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-24 px-4 max-w-7xl mx-auto text-center space-y-10 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full badge-violet"
        >
          <Sparkles className="w-4 h-4" />
          <span>Introducing Adaptive Multi-Sensor AI Coaching</span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold leading-tight tracking-tight text-white max-w-5xl mx-auto"
        >
          Master Placement Interviews with{' '}
          <span className="text-gradient animate-pulse-glow">
            Adaptive AI Coach
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-slate-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed"
        >
          MockMate X AI conducts dynamic mock reviews, analyzing voice pacing, eye contact, and confidence levels in real time to secure top software engineering offers.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2"
        >
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => navigate('/signup')}
            icon={<ChevronRight className="w-5 h-5" />}
            className="shadow-glow-lg"
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
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4, type: 'spring' }}
          className="pt-12 max-w-5xl mx-auto relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-cyan-400/20 blur-3xl -z-10 rounded-3xl" />
          <Card variant="glass" size="lg" className="rounded-3xl border-white/10 shadow-glass-lg">
            <div className="bg-slate-950/50 rounded-2xl border border-white/5 overflow-hidden">
              {/* Fake UI Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900/50 to-slate-800/20 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/70 hover:bg-rose-500 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/70 hover:bg-amber-500 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70 hover:bg-emerald-500 transition-colors" />
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  biometric_feedback_v1.bin
                </div>
                <div className="w-4 h-4 rounded bg-cyan-400/20 border border-cyan-400/30" />
              </div>
              {/* Fake UI Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                <Card variant="elevated" size="md" interactive glowColor="cyan">
                  <div className="flex flex-col items-center justify-center gap-3 h-full">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                      <Video className="w-6 h-6 text-cyan-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">Face Recognition</span>
                    <div className="w-full h-24 rounded-lg bg-slate-900/60 border border-white/5 relative overflow-hidden flex items-center justify-center">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"
                        alt="Mock Face Tracking"
                        className="w-full h-full object-cover opacity-70"
                      />
                      <div className="absolute inset-0 border-2 border-cyan-400/40 rounded-lg m-2 flex items-center justify-center">
                        <div className="text-[8px] font-mono text-cyan-300 bg-slate-950/90 px-2 py-1 rounded border border-cyan-400/20">LOCKED: 91%</div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card variant="elevated" size="md" interactive glowColor="purple">
                  <div className="flex flex-col items-center justify-center gap-3 h-full">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                      <Mic className="w-6 h-6 text-violet-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">Speech Pattern</span>
                    <div className="w-full h-24 rounded-lg bg-slate-900/60 border border-white/5 flex flex-col items-center justify-center px-4">
                      <Waveform isPlaying={true} barCount={18} height={40} />
                      <span className="text-[9px] font-mono text-violet-300 mt-2">132 WPM • Natural Pacing</span>
                    </div>
                  </div>
                </Card>

                <Card variant="elevated" size="md" interactive glowColor="pink">
                  <div className="flex flex-col justify-between gap-4 h-full">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                        <Cpu className="w-6 h-6 text-emerald-400" />
                      </div>
                      <span className="text-xs font-bold text-white">AI Tips</span>
                    </div>
                    <div className="text-[10px] text-slate-300 space-y-2.5 font-mono">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span>Eye contact: Optimal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-amber-400 flex-shrink-0" />
                        <span>"Uh" used: 0 times</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                        <span>Confidence: Rising</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
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
      </section>

      {/* 2. CORPORATE PREP LOGOS */}
      <section className="max-w-7xl mx-auto px-4 text-center space-y-8 z-10 relative">
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Simulate Interviews at Top Tier Companies
          </h3>
          <p className="text-sm text-slate-500">Practice with questions from companies you aspire to join</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {MOCK_COMPANIES.map((c) => (
            <motion.div 
              key={c.name} 
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex items-center gap-3 p-3 rounded-lg hover-lift transition-all cursor-pointer group"
            >
              <span className={`text-3xl font-black ${c.color} font-display group-hover:drop-shadow-lg transition-all`}>{c.logo}</span>
              <span className="text-sm font-extrabold text-slate-300 group-hover:text-white tracking-wider uppercase transition-colors">{c.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. CORE FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-4 space-y-12 z-10 relative">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white">Multimodal AI Placement Training</h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
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
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 flex items-center justify-center group-hover:shadow-glow-cyan transition-all">
                  <Video className="w-7 h-7 text-cyan-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">Face & Gesture Tracker</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Calculates live gaze alignment ratios, nervousness indicators, and facial expressiveness during interviews.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold pt-2 border-t border-white/5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Real-time feedback
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card variant="elevated" size="lg" interactive glowColor="purple" className="h-full">
              <div className="space-y-5 flex flex-col h-full justify-between">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 border border-violet-500/30 flex items-center justify-center">
                  <Mic className="w-7 h-7 text-violet-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">Speech Pattern Engine</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Counts filler words like "like", "basically", and "um" while analyzing words per minute and tone.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold pt-2 border-t border-white/5">
                  <Zap className="w-3.5 h-3.5" />
                  Detailed analysis
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card variant="elevated" size="lg" interactive glowColor="pink" className="h-full">
              <div className="space-y-5 flex flex-col h-full justify-between">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-500/5 border border-fuchsia-500/30 flex items-center justify-center">
                  <Cpu className="w-7 h-7 text-fuchsia-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">Adaptive Follow-ups</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Questions adapt dynamically based on your answers, testing your technical boundaries in real-time.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-fuchsia-400 text-xs font-semibold pt-2 border-t border-white/5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Personalized
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* 4. DEMO INTERACTIVE PREVIEW */}
      <section id="demo" className="max-w-5xl mx-auto px-4 z-10 relative">
        <Card variant="glass" size="lg" className="rounded-3xl border-white/10 shadow-glass-lg">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="space-y-5 flex-1">
              <div className="inline-flex items-center gap-2 badge-cyan">
                <Zap className="w-3 h-3" />
                <span className="text-xs font-bold uppercase">Live Mock Simulation</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white leading-tight">
                Try Out the Interview Space
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Step directly into a fully simulated video workspace with an interactive AI interviewer. Test your mic, turn on your camera, and experience the complete dashboard immediately.
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/login')}
                icon={<ArrowUpRight className="w-4 h-4" />}
                className="shadow-glow-lg mt-2"
              >
                Sign In to Start Now
              </Button>
            </div>
            <div className="w-full md:w-1/2 rounded-2xl border-2 border-white/10 overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-slate-900/50 to-slate-950 flex flex-col items-center justify-center rounded-xl">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600/20 to-cyan-400/10 border-2 border-violet-500/30 flex items-center justify-center"
                >
                  <Video className="w-7 h-7 text-violet-400" />
                </motion.div>
                <span className="text-[11px] text-slate-400 font-mono mt-4 uppercase tracking-wider">
                  Webcam Detection Ready
                </span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-8 z-10 relative pb-10">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white">
            Ready to ace your interviews?
          </h2>
          <p className="text-slate-400 text-base">
            Join thousands of students preparing for their dream roles
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/signup')}
            className="shadow-glow-lg"
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
      </section>
    </div>
  );
};

export default LandingPage;
