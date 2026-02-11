import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Rocket,
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  Trash2,
  ExternalLink,
  Plus,
  BookOpen,
  TrendingUp,
  Award,
  Settings,
  ChevronRight,
  Sparkles,
  Brain,
  Users,
  Zap,
  Flame,
  Star,
  Gift,
  BarChart3
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { ProgressRing, WeeklyProgressChart, StreakCounter, SkillBars, AnimatedCounter } from '../components/ProgressWidgets';
import { AchievementCard, achievements as allAchievements } from '../components/Achievements';
import { QuickActionsCompact } from '../components/QuickActions';
import { useRealStats } from '../hooks/useRealStats';

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [activeProjects, setActiveProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [showAchievements, setShowAchievements] = useState(false);

  const { stats, skills, weeklyActivity, unlockedAchievementIds, recalculate } = useRealStats();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load user's projects from localStorage
    const savedProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    const active = savedProjects.filter(p => p.status !== 'completed');
    const completed = savedProjects.filter(p => p.status === 'completed');
    
    setActiveProjects(active);
    setCompletedProjects(completed);
    recalculate();
  }, [isAuthenticated, loading, navigate, recalculate]);

  const handleDeleteProject = (projectId) => {
    const savedProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    const updated = savedProjects.filter(p => p.id !== projectId);
    localStorage.setItem('userProjects', JSON.stringify(updated));
    
    setActiveProjects(updated.filter(p => p.status !== 'completed'));
    setCompletedProjects(updated.filter(p => p.status === 'completed'));
    recalculate();
  };

  const handleToggleStatus = (projectId) => {
    const savedProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    const updated = savedProjects.map(p => {
      if (p.id === projectId) {
        return { ...p, status: p.status === 'paused' ? 'active' : 'paused' };
      }
      return p;
    });
    localStorage.setItem('userProjects', JSON.stringify(updated));
    setActiveProjects(updated.filter(p => p.status !== 'completed'));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-pattern">
        <div className="w-12 h-12 border-4 border-neon-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-pattern">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center overflow-hidden">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue flex items-center justify-center text-white text-xs font-bold">
                    {stats.level}
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                    Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 
                    <motion.span
                      animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      👋
                    </motion.span>
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-deep-blue-400">{user?.email}</span>
                    <span className="px-2 py-0.5 rounded-full bg-neon-purple-500/20 text-neon-purple-400 text-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <AnimatedCounter value={stats.xp} /> XP
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StreakCounter streak={stats.streak} />
                <Link to="/survey">
                  <motion.button
                    className="btn-primary flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-5 h-5" />
                    New Project
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content - Left 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="card-glass p-4 text-center group hover:border-neon-purple-500/50 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-neon-purple-500/20 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <Rocket className="w-6 h-6 text-neon-purple-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    <AnimatedCounter value={stats.totalProjects} />
                  </p>
                  <p className="text-sm text-deep-blue-400">Projects</p>
                </div>

                <div className="card-glass p-4 text-center group hover:border-cyber-blue/50 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-cyber-blue/20 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-6 h-6 text-cyber-blue" />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    <AnimatedCounter value={stats.completedTasks} />
                  </p>
                  <p className="text-sm text-deep-blue-400">Tasks Done</p>
                </div>

                <div className="card-glass p-4 text-center group hover:border-green-500/50 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">Week {stats.currentWeek}</p>
                  <p className="text-sm text-deep-blue-400">Current</p>
                </div>

                <div className="card-glass p-4 text-center group hover:border-orange-500/50 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6 text-orange-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    <AnimatedCounter value={unlockedAchievementIds.length} />/{allAchievements.length}
                  </p>
                  <p className="text-sm text-deep-blue-400">Achievements</p>
                </div>
              </motion.div>

              {/* Active Projects */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-neon-purple-400" />
                  Active Projects
                </h2>

                {activeProjects.length === 0 ? (
                  <div className="card-glass p-8 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-purple-500/20 to-cyber-blue/20 flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-10 h-10 text-neon-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Ready to start your AI journey?</h3>
                    <p className="text-deep-blue-400 mb-6 max-w-md mx-auto">
                      Take our quick survey to get personalized AI project recommendations tailored to your skills and interests.
                    </p>
                    <Link to="/survey">
                      <motion.button 
                        className="btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Get AI Project Recommendations
                      </motion.button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {activeProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        className="card-glass p-6 hover:border-neon-purple-500/50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                project.status === 'active' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {project.status === 'active' ? '🚀 In Progress' : '⏸️ Paused'}
                              </span>
                              <span className="text-deep-blue-500 text-sm">
                                Week {project.currentWeek || 1} of 4
                              </span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
                            <p className="text-deep-blue-400 text-sm mb-3 line-clamp-2">{project.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tech_stack?.slice(0, 4).map((tech, i) => (
                                <span key={i} className="px-2 py-1 rounded-lg bg-deep-blue-800/50 text-xs text-cyber-blue">
                                  {tech}
                                </span>
                              ))}
                              {project.tech_stack?.length > 4 && (
                                <span className="px-2 py-1 rounded-lg bg-deep-blue-800/50 text-xs text-deep-blue-400">
                                  +{project.tech_stack.length - 4} more
                                </span>
                              )}
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-2">
                              <div className="flex justify-between text-xs text-deep-blue-400 mb-1">
                                <span>Progress</span>
                                <span>{(() => { const ct = project.completedTasks || {}; const total = project.roadmap?.reduce((a,w) => a + (w.tasks?.length || 0), 0) || 1; const done = Object.values(ct).filter(Boolean).length; return Math.round((done/total)*100); })()}%</span>
                              </div>
                              <div className="h-2 bg-deep-blue-800 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(() => { const ct = project.completedTasks || {}; const total = project.roadmap?.reduce((a,w) => a + (w.tasks?.length || 0), 0) || 1; const done = Object.values(ct).filter(Boolean).length; return Math.round((done/total)*100); })()}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Link to={`/project/${project.id}`}>
                              <motion.button 
                                className="p-2 rounded-lg bg-neon-purple-500/20 hover:bg-neon-purple-500/30 text-neon-purple-400 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <ChevronRight className="w-5 h-5" />
                              </motion.button>
                            </Link>
                            <motion.button 
                              onClick={() => handleToggleStatus(project.id)}
                              className="p-2 rounded-lg bg-deep-blue-700/50 hover:bg-deep-blue-700 text-deep-blue-300 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {project.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                            </motion.button>
                            <motion.button 
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Weekly Progress Chart */}
              <motion.div
                className="card-glass p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyber-blue" />
                  Weekly Activity
                </h3>
                <WeeklyProgressChart data={weeklyActivity} />
              </motion.div>
            </div>

            {/* Sidebar - Right column */}
            <div className="space-y-6">
              {/* Level Progress */}
              <motion.div
                className="card-glass p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Level Progress
                </h3>
                <div className="flex items-center gap-6">
                  <ProgressRing 
                    progress={(stats.xp % 500) / 500 * 100} 
                    size={100} 
                    strokeWidth={8}
                  >
                    <span className="text-white font-bold text-sm">Level {stats.level}</span>
                  </ProgressRing>
                  <div>
                    <p className="text-white font-semibold">{stats.xp} XP</p>
                    <p className="text-sm text-deep-blue-400">{500 - (stats.xp % 500)} XP to Level {stats.level + 1}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <Gift className="w-4 h-4 text-neon-purple-400" />
                      <span className="text-xs text-neon-purple-400">Reward unlocks at Level {stats.level + 1}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Skills */}
              <motion.div
                className="card-glass p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyber-blue" />
                  Your Skills
                </h3>
                <SkillBars skills={skills.length > 0 ? skills : [{ name: 'Start a project to track skills', color: '#8B5CF6', colorEnd: '#7C3AED', level: 0 }]} />
              </motion.div>

              {/* Achievements Preview */}
              <motion.div
                className="card-glass p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-orange-400" />
                    Recent Achievements
                  </h3>
                  <button 
                    onClick={() => setShowAchievements(true)}
                    className="text-sm text-neon-purple-400 hover:text-neon-purple-300 transition-colors"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {allAchievements.filter(a => unlockedAchievementIds.includes(a.id)).slice(0, 3).map((achievement) => (
                    <div 
                      key={achievement.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-deep-blue-800/30"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${achievement.color} flex items-center justify-center`}>
                        <achievement.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{achievement.title}</p>
                        <p className="text-xs text-deep-blue-400">+{achievement.points} XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <QuickActionsCompact />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Modal */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAchievements(false)}
          >
            <motion.div
              className="w-full max-w-3xl max-h-[80vh] overflow-auto card-glass rounded-2xl p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-orange-400" />
                  All Achievements
                </h2>
                <button 
                  onClick={() => setShowAchievements(false)}
                  className="p-2 rounded-lg hover:bg-deep-blue-700 text-deep-blue-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allAchievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    isUnlocked={unlockedAchievementIds.includes(achievement.id)}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
