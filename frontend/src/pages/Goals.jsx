import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import {
  Target, Clock, Flame, Save, Check, Briefcase,
  GraduationCap, Sparkles, Settings2, Bell
} from 'lucide-react';

const roleOptions = ['Backend Developer', 'Frontend Developer', 'Full-Stack Developer', 'ML Engineer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer', 'Cloud Architect'];
const timeOptions = [
  { label: '6 months', value: 6 },
  { label: '12 months', value: 12 },
  { label: '24 months', value: 24 },
];

const Goals = () => {
  const [selectedRoles, setSelectedRoles] = useState(['Backend Developer', 'ML Engineer']);
  const [timeHorizon, setTimeHorizon] = useState(12);
  const [hoursPerWeek, setHoursPerWeek] = useState(12);
  const [notifications, setNotifications] = useState(true);
  const [weeklyReminder, setWeeklyReminder] = useState(true);
  const [saved, setSaved] = useState(false);

  const toggleRole = (role) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : prev.length < 3 ? [...prev, role] : prev
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Goals & Settings</h1>
          <p className="text-deep-blue-400 text-sm">Customize your career path and preferences</p>
        </motion.div>

        <div className="space-y-6">
          {/* Desired Roles */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-glass p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple-500 to-cyber-purple flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Desired Roles</h2>
                <p className="text-xs text-deep-blue-400">Select up to 3 roles you want to pursue</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {roleOptions.map(role => (
                <button
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    selectedRoles.includes(role)
                      ? 'bg-neon-purple-500/20 text-neon-purple-400 border-neon-purple-500/40 shadow-sm shadow-neon-purple-500/10'
                      : 'text-deep-blue-300 border-deep-blue-700 hover:border-deep-blue-500 hover:text-white'
                  }`}
                >
                  {selectedRoles.includes(role) && <Check className="w-3.5 h-3.5 inline mr-1.5" />}
                  {role}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Time Horizon */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-glass p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Time Horizon</h2>
                <p className="text-xs text-deep-blue-400">When do you want to reach your goal?</p>
              </div>
            </div>
            <div className="flex gap-2">
              {timeOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setTimeHorizon(opt.value)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border text-center ${
                    timeHorizon === opt.value
                      ? 'bg-cyber-blue/15 text-cyber-blue border-cyber-blue/40'
                      : 'text-deep-blue-400 border-deep-blue-700 hover:border-deep-blue-500 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Hours per Week */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-glass p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Hours per Week</h2>
                <p className="text-xs text-deep-blue-400">How many hours can you dedicate weekly?</p>
              </div>
            </div>
            <div className="space-y-4">
              <input
                type="range" min="1" max="40" value={hoursPerWeek}
                onChange={e => setHoursPerWeek(Number(e.target.value))}
                className="w-full h-2 bg-deep-blue-800 rounded-full appearance-none cursor-pointer accent-neon-purple-500"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-deep-blue-500">1 hr</span>
                <span className="text-2xl font-bold gradient-text">{hoursPerWeek} hrs/week</span>
                <span className="text-xs text-deep-blue-500">40 hrs</span>
              </div>
              <p className="text-xs text-deep-blue-400 text-center">
                {hoursPerWeek <= 5 ? '☕ Relaxed pace — great for busy schedules' :
                 hoursPerWeek <= 15 ? '🔥 Solid pace — visible progress every week' :
                 hoursPerWeek <= 25 ? '🚀 Intense — you\'ll level up fast' :
                 '⚡ Full-time mode — maximum growth!'}
              </p>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-glass p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Notifications</h2>
                <p className="text-xs text-deep-blue-400">Stay on track with reminders</p>
              </div>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-deep-blue-800/30 transition-colors">
                <div>
                  <p className="text-sm text-white">Push Notifications</p>
                  <p className="text-xs text-deep-blue-500">Get notified about new tasks and achievements</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-0.5 transition-colors ${notifications ? 'bg-neon-purple-500' : 'bg-deep-blue-700'}`}
                  onClick={() => setNotifications(!notifications)}
                >
                  <motion.div animate={{ x: notifications ? 24 : 0 }} className="w-5 h-5 rounded-full bg-white shadow-sm" />
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-deep-blue-800/30 transition-colors">
                <div>
                  <p className="text-sm text-white">Weekly Check-in Reminder</p>
                  <p className="text-xs text-deep-blue-500">Remind me to fill in my weekly survey</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-0.5 transition-colors ${weeklyReminder ? 'bg-neon-purple-500' : 'bg-deep-blue-700'}`}
                  onClick={() => setWeeklyReminder(!weeklyReminder)}
                >
                  <motion.div animate={{ x: weeklyReminder ? 24 : 0 }} className="w-5 h-5 rounded-full bg-white shadow-sm" />
                </div>
              </label>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <button onClick={handleSave} className={`btn-primary w-full !py-3 flex items-center justify-center gap-2 text-base ${saved ? '!bg-green-500/20 !border-green-500/30' : ''}`}>
              {saved ? <><Check className="w-5 h-5 text-green-400" /> <span className="text-green-400">Saved successfully!</span></> : <><Save className="w-5 h-5" /> Save Settings</>}
            </button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Goals;
