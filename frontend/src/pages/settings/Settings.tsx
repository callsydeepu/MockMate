import React, { useState } from 'react';
import { Video, Mic, Bell, Shield, HardDrive, Sparkles } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [biometricsLog, setBiometricsLog] = useState(true);
  const [selectedCam, setSelectedCam] = useState('FaceTime HD Camera (Built-in)');
  const [selectedMic, setSelectedMic] = useState('Default External Microphone (USB)');

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleSavePreferences = () => {
    toast.success('System preferences saved successfully!');
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass || !newPass) {
      toast.error('Please fill in password fields.');
      return;
    }
    setIsChangingPass(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success('Your security password has been updated.');
    setOldPass('');
    setNewPass('');
    setIsChangingPass(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-display font-extrabold text-white">System Settings</h1>
        <p className="text-slate-400 text-xs font-medium">Configure hardware parameters, notification rules, and password options</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: hardware controls & toggle rules (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hardware setup */}
          <Card className="border-white/5 space-y-4">
            <div>
              <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-cyan-400" /> Device Setup
              </h3>
              <p className="text-[10px] text-slate-500">Choose standard webcam and sound feeds prior to starting interviews</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-slate-400" /> Webcam feed
                </label>
                <select
                  value={selectedCam}
                  onChange={(e) => setSelectedCam(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs glass-input bg-slate-900 border border-white/10 text-white rounded-lg focus:outline-none"
                >
                  <option value="cam1">FaceTime HD Camera (Built-in)</option>
                  <option value="cam2">External USB Web Camera (1080p)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-slate-400" /> Microphone sound feed
                </label>
                <select
                  value={selectedMic}
                  onChange={(e) => setSelectedMic(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs glass-input bg-slate-900 border border-white/10 text-white rounded-lg focus:outline-none"
                >
                  <option value="mic1">Default External Microphone (USB)</option>
                  <option value="mic2">Built-in Internal Microphone Array</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Preferences and notifications */}
          <Card className="border-white/5 space-y-4">
            <div>
              <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-violet-400" /> Notification Rules
              </h3>
              <p className="text-[10px] text-slate-500">Adjust emails alerts and biometric telemetry tracking preferences</p>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-slate-900/40">
                <div className="space-y-0.5 max-w-[80%]">
                  <span className="text-xs font-bold text-white block">Email placement digests</span>
                  <span className="text-[10px] text-slate-500 block leading-relaxed">
                    Receive weekly performance reports and recommendations in your university inbox.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-white/10 text-violet-600 focus:ring-violet-500/50"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-slate-900/40">
                <div className="space-y-0.5 max-w-[80%]">
                  <span className="text-xs font-bold text-white block flex items-center gap-1.5">
                    Biometric Telemetry Storage <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-relaxed">
                    Allow MockMate X AI to store local coordinates history to generate comparison graphs.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={biometricsLog}
                  onChange={(e) => setBiometricsLog(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-white/10 text-violet-600 focus:ring-violet-500/50"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" onClick={handleSavePreferences} className="rounded-xl px-5 py-2 text-xs font-bold">
                Save Preferences
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: password form (1 column) */}
        <Card className="lg:col-span-1 border-white/5 space-y-4">
          <div>
            <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" /> Account Security
            </h3>
            <p className="text-[10px] text-slate-500">Update password</p>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Current Password</label>
              <input
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 text-xs glass-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">New Password</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 text-xs glass-input"
              />
            </div>

            <div className="pt-2">
              <Button variant="danger" type="submit" loading={isChangingPass} className="w-full py-2.5 text-xs font-bold rounded-xl">
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
