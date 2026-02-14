import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Key,
  Trash2,
  Save,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Download,
  LogOut,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme: currentTheme, setTheme: applyTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [saveStatus, setSaveStatus] = useState(null);
  
  // Settings state
  const [settings, setSettings] = useState({
    // Profile
    displayName: user?.name || '',
    email: user?.email || '',
    bio: '',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    projectUpdates: true,
    communityActivity: false,
    marketingEmails: false,
    
    // Privacy
    profilePublic: true,
    showActivity: true,
    showProjects: true,
    showAchievements: true,
    
    // Appearance
    theme: currentTheme,
    reducedMotion: false,
    soundEffects: true,
    
    // Language
    language: 'en',
    timezone: 'UTC'
  });

  // Sync theme changes to ThemeContext immediately
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme, applyTheme]);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('userSettings', JSON.stringify(settings));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    }, 1000);
  };

  const handleExportData = () => {
    const data = {
      user: user,
      settings: settings,
      projects: JSON.parse(localStorage.getItem('userProjects') || '[]'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sanapath-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'account', label: 'Account', icon: Key }
  ];

  return (
    <div className="min-h-screen bg-hero-pattern">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-deep-blue-400">Manage your account settings and preferences</p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="card-glass p-4 space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-neon-purple-500/20 text-neon-purple-400'
                        : 'text-deep-blue-300 hover:bg-deep-blue-800/50 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="card-glass p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-neon-purple-400" />
                      Profile Settings
                    </h2>
                    
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center overflow-hidden">
                          {user?.avatar_url ? (
                            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-12 h-12 text-white" />
                          )}
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-2 rounded-full bg-neon-purple-500 text-white hover:bg-neon-purple-600 transition-colors">
                          <Palette className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <p className="text-white font-medium">{user?.name || 'User'}</p>
                        <p className="text-sm text-deep-blue-400">{user?.email}</p>
                        <button className="mt-2 text-sm text-neon-purple-400 hover:text-neon-purple-300 transition-colors">
                          Change avatar
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-deep-blue-300 mb-2">Display Name</label>
                        <input
                          type="text"
                          value={settings.displayName}
                          onChange={(e) => handleChange('displayName', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-deep-blue-900/50 border border-deep-blue-700 text-white placeholder-deep-blue-500 focus:outline-none focus:border-neon-purple-500 transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-deep-blue-300 mb-2">Bio</label>
                        <textarea
                          value={settings.bio}
                          onChange={(e) => handleChange('bio', e.target.value)}
                          rows={3}
                          placeholder="Tell us about yourself..."
                          className="w-full px-4 py-3 rounded-xl bg-deep-blue-900/50 border border-deep-blue-700 text-white placeholder-deep-blue-500 focus:outline-none focus:border-neon-purple-500 transition-colors resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Bell className="w-5 h-5 text-neon-purple-400" />
                      Notification Preferences
                    </h2>
                    
                    <div className="space-y-4">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                        { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                        { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of your progress' },
                        { key: 'projectUpdates', label: 'Project Updates', desc: 'Updates on your active projects' },
                        { key: 'communityActivity', label: 'Community Activity', desc: 'New posts and discussions' },
                        { key: 'marketingEmails', label: 'Marketing Emails', desc: 'News and promotional content' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-deep-blue-800/30">
                          <div>
                            <p className="text-white font-medium">{item.label}</p>
                            <p className="text-sm text-deep-blue-400">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => handleChange(item.key, !settings[item.key])}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              settings[item.key] ? 'bg-neon-purple-500' : 'bg-deep-blue-700'
                            }`}
                          >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                              settings[item.key] ? 'left-7' : 'left-1'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-neon-purple-400" />
                      Privacy Settings
                    </h2>
                    
                    <div className="space-y-4">
                      {[
                        { key: 'profilePublic', label: 'Public Profile', desc: 'Allow others to view your profile', icon: Eye },
                        { key: 'showActivity', label: 'Show Activity', desc: 'Display your recent activity', icon: Globe },
                        { key: 'showProjects', label: 'Show Projects', desc: 'Make your projects visible', icon: Eye },
                        { key: 'showAchievements', label: 'Show Achievements', desc: 'Display your achievements', icon: Eye }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-deep-blue-800/30">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-deep-blue-700/50">
                              <item.icon className="w-5 h-5 text-deep-blue-300" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{item.label}</p>
                              <p className="text-sm text-deep-blue-400">{item.desc}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleChange(item.key, !settings[item.key])}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              settings[item.key] ? 'bg-neon-purple-500' : 'bg-deep-blue-700'
                            }`}
                          >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                              settings[item.key] ? 'left-7' : 'left-1'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Appearance Tab */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Palette className="w-5 h-5 text-neon-purple-400" />
                      Appearance Settings
                    </h2>
                    
                    <div>
                      <label className="block text-sm text-deep-blue-300 mb-3">Theme</label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { id: 'dark', label: 'Dark', icon: Moon },
                          { id: 'light', label: 'Light', icon: Sun },
                          { id: 'system', label: 'System', icon: Globe }
                        ].map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => handleChange('theme', theme.id)}
                            className={`p-4 rounded-xl border transition-all ${
                              settings.theme === theme.id
                                ? 'border-neon-purple-500 bg-neon-purple-500/20'
                                : 'border-deep-blue-700 hover:border-deep-blue-500'
                            }`}
                          >
                            <theme.icon className={`w-6 h-6 mx-auto mb-2 ${
                              settings.theme === theme.id ? 'text-neon-purple-400' : 'text-deep-blue-400'
                            }`} />
                            <p className={`text-sm ${
                              settings.theme === theme.id ? 'text-white' : 'text-deep-blue-400'
                            }`}>{theme.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-deep-blue-800/30">
                        <div>
                          <p className="text-white font-medium">Reduced Motion</p>
                          <p className="text-sm text-deep-blue-400">Minimize animations</p>
                        </div>
                        <button
                          onClick={() => handleChange('reducedMotion', !settings.reducedMotion)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.reducedMotion ? 'bg-neon-purple-500' : 'bg-deep-blue-700'
                          }`}
                        >
                          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                            settings.reducedMotion ? 'left-7' : 'left-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-deep-blue-800/30">
                        <div className="flex items-center gap-3">
                          {settings.soundEffects ? (
                            <Volume2 className="w-5 h-5 text-deep-blue-300" />
                          ) : (
                            <VolumeX className="w-5 h-5 text-deep-blue-300" />
                          )}
                          <div>
                            <p className="text-white font-medium">Sound Effects</p>
                            <p className="text-sm text-deep-blue-400">Play sounds for interactions</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleChange('soundEffects', !settings.soundEffects)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.soundEffects ? 'bg-neon-purple-500' : 'bg-deep-blue-700'
                          }`}
                        >
                          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                            settings.soundEffects ? 'left-7' : 'left-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Key className="w-5 h-5 text-neon-purple-400" />
                      Account Settings
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-deep-blue-800/30">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-white font-medium">Email Address</p>
                            <p className="text-sm text-deep-blue-400">{user?.email}</p>
                          </div>
                          <button className="px-4 py-2 rounded-lg bg-deep-blue-700 text-white hover:bg-deep-blue-600 transition-colors">
                            Change
                          </button>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-deep-blue-800/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">Password</p>
                            <p className="text-sm text-deep-blue-400">Last changed 30 days ago</p>
                          </div>
                          <button className="px-4 py-2 rounded-lg bg-deep-blue-700 text-white hover:bg-deep-blue-600 transition-colors">
                            Change
                          </button>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-cyber-blue/10 border border-cyber-blue/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Download className="w-5 h-5 text-cyber-blue" />
                            <div>
                              <p className="text-white font-medium">Export Your Data</p>
                              <p className="text-sm text-deep-blue-400">Download all your data</p>
                            </div>
                          </div>
                          <button 
                            onClick={handleExportData}
                            className="px-4 py-2 rounded-lg bg-cyber-blue/20 text-cyber-blue hover:bg-cyber-blue/30 transition-colors"
                          >
                            Export
                          </button>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Trash2 className="w-5 h-5 text-red-400" />
                            <div>
                              <p className="text-white font-medium">Delete Account</p>
                              <p className="text-sm text-deep-blue-400">Permanently delete your account</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-deep-blue-400 hover:text-white hover:bg-deep-blue-800/50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                  
                  <motion.button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-purple-500 to-cyber-blue text-white font-medium hover:shadow-lg hover:shadow-neon-purple-500/25 transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : saveStatus === 'saved' ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;
