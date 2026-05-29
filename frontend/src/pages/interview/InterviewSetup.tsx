import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Zap } from 'lucide-react';

const COMPANIES = [
  { name: 'Google', streams: ['Software Engineer', 'Product Manager', 'Data Scientist'] },
  { name: 'Amazon', streams: ['Frontend Engineer', 'Backend Engineer', 'Operations Manager'] },
  { name: 'Microsoft', streams: ['Cloud Engineer', 'AI Researcher', 'UX Designer'] },
];

const COMPANY_REQUIREMENTS: { [key: string]: string[] } = {
  Google: ['Data structures & algorithms', 'System design basics', 'Behavioral STAR format'],
  Amazon: ['Leadership principles', 'Coding efficiency', 'Problem solving under pressure'],
  Microsoft: ['Cloud services knowledge', 'Collaboration skills', 'Product thinking'],
};

export const InterviewSetup: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('30');

  const handleStart = () => {
    if (!selectedCompany || !selectedProfile || !selectedDuration) return;
    navigate('/interview/session', { state: { company: selectedCompany, role: selectedProfile, duration: selectedDuration } });
  };

  return (
    <div className="flex flex-col items-center py-6 px-4">
      <motion.h1
        className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 mb-8 flex items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Choose Your Mock Interview
      </motion.h1>

      {/* Company selection cards */}
      <div className="grid gap-6 w-full max-w-4xl md:grid-cols-3">
        {COMPANIES.map((c) => (
          <motion.button
            key={c.name}
            onClick={() => { setSelectedCompany(c.name); setSelectedProfile(''); }}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${
              selectedCompany === c.name 
                ? 'border-violet-500 bg-violet-600/10 text-violet-750 shadow-md shadow-violet-500/5' 
                : 'border-slate-200 bg-white/70 hover:border-violet-400 hover:bg-white text-slate-600 hover:text-slate-900'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Camera className="w-10 h-10 text-violet-500" />
            <span className="text-lg font-bold">{c.name}</span>
          </motion.button>
        ))}
      </div>

          {/* Duration dropdown */}
          {selectedCompany && selectedProfile && (
            <motion.div className="mt-6 w-full max-w-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Interview Duration</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-white/80 border border-slate-200/60 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                <option value="">-- Choose duration --</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
              </select>
            </motion.div>
          )}

      {/* Stream dropdown */}
      {selectedCompany && (
        <motion.div className="mt-6 w-full max-w-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Role / Interview Profile</label>
          <select
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            className="w-full px-4 py-2.5 text-xs bg-white/80 border border-slate-200/60 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="">-- Choose a role --</option>
            {COMPANIES.find((c) => c.name === selectedCompany)!.streams.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </motion.div>
      )}

      {/* Company requirements */}
      {selectedCompany && (
        <motion.div className="mt-6 w-full max-w-md bg-white/85 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/50 shadow-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="text-sm font-bold mb-2.5 text-violet-750">{selectedCompany} Interview Requirements</h3>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 font-semibold">
            {COMPANY_REQUIREMENTS[selectedCompany].map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Start button */}
      {selectedCompany && selectedProfile && selectedDuration && (
        <motion.button
          onClick={handleStart}
          className="mt-8 flex items-center px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-bold transition-colors cursor-pointer shadow-lg shadow-violet-500/10"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Zap className="w-4 h-4 mr-2" />
          Start Interview
        </motion.button>
      )}
    </div>
  );
};

export default InterviewSetup;
