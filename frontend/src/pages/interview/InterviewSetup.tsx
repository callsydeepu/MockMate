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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-800 text-gray-100 flex flex-col items-center py-12 px-4">
      <motion.h1
        className="text-4xl font-bold mb-8"
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
            className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${selectedCompany === c.name ? 'border-violet-500 bg-violet-900/30' : 'border-gray-600 hover:border-violet-400'}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Camera className="w-12 h-12 text-violet-300" />
            <span className="text-xl font-medium">{c.name}</span>
          </motion.button>
        ))}
      </div>

          {/* Duration dropdown */}
          {selectedCompany && selectedProfile && (
            <motion.div className="mt-4 w-full max-w-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <label className="block text-sm font-medium mb-2">Select Interview Duration</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full rounded-lg bg-slate-800 border border-gray-600 text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
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
        <motion.div className="mt-8 w-full max-w-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <label className="block text-sm font-medium mb-2">Select Role / Interview Profile</label>
          <select
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-gray-600 text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
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
        <motion.div className="mt-6 w-full max-w-md bg-slate-800/60 backdrop-blur-sm rounded-lg p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="text-lg font-medium mb-2 text-violet-300">{selectedCompany} Interview Requirements</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
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
          className="mt-8 flex items-center px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-lg text-white font-semibold transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Zap className="w-5 h-5 mr-2" />
          Start Interview
        </motion.button>
      )}
    </div>
  );
};

export default InterviewSetup;
