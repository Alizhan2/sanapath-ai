import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRealStats } from '../hooks/useRealStats';
import { useRoadmapData } from '../hooks/useRoadmapData';
import { computeSkillCategories, getTopSkillsFlat } from '../hooks/useSkillsData';
import { useToast } from '../components/Toast';
import DashboardLayout from '../components/DashboardLayout';
import { ProgressRing, WeeklyProgressChart, StreakCounter, SkillBars, AnimatedCounter } from '../components/ProgressWidgets';
import { AchievementCard, achievements as allAchievements } from '../components/Achievements';
import {
  User, Rocket, Target, Calendar, CheckCircle2, Clock,
  Plus, Award, ChevronRight, Sparkles, Brain, Zap,
  Flame, Star, BarChart3, Github, Linkedin, Map,
  ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [activeProjects, setActiveProjects] = useState([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const { stats, skills, weeklyActivity, unlockedAchievementIds, recalculate } = useRealStats();
  const { steps, weekTasks, overallProgress, currentStep, doneTasks, totalTasks, toggleTaskStatus } = useRoadmapData();
  const toast = useToast();

  // Simulated connected state — set true once user has any projects or completed survey
  const [profileReady, setProfileReady] = useState(false);

  // Toast on task completion
  useEffect(() => {
    const handleTaskDone = (e) => {
      toast.success(`✅ Task completed: ${e.detail.title} (+25 XP)`);
    };
    window.addEventListener('taskCompleted', handleTaskDone);
    return () => window.removeEventListener('taskCompleted', handleTaskDone);
  }, [toast]);

  // Toast on achievement unlock
  useEffect(() => {
    const handleAchievement = (e) => {
      const found = allAchievements.find(a => a.id === e.detail.id);
      if (found) {
        toast.success(`🏆 Achievement Unlocked: ${found.title} (+${found.points} XP)`);
      }
    };
    window.addEventListener('achievementUnlocked', handleAchievement);
    return () => window.removeEventListener('achievementUnlocked', handleAchievement);
  }, [toast]);

  useEffect(() => {
    if (!loading && !isAuthenticated) { navigate('/login'); return; }
    
    // Load projects from backend API, fallback to localStorage
    const loadProjects = async () => {
      try {
        const { projectsAPI } = await import('../services/api');
        const data = await projectsAPI.getMyProjects();
        const apiProjects = data.projects || [];
        if (apiProjects.length > 0) {
          setActiveProjects(apiProjects);
          // Sync to localStorage for offline hooks
          localStorage.setItem('userProjects', JSON.stringify(apiProjects));
        } else {
          // Fallback to localStorage
          const saved = JSON.parse(localStorage.getItem('userProjects') || '[]');
          setActiveProjects(saved);
        }
      } catch {
        // Offline or error — use localStorage
        const saved = JSON.parse(localStorage.getItem('userProjects') || '[]');
        setActiveProjects(saved);
      }
    };
    loadProjects();
    
    // If user has projects or saved goals, treat as ready
    if (activeProjects.length > 0 || localStorage.getItem('sanapath_goals')) { setProfileReady(true); }
    recalculate();
  }, [isAuthenticated, loading, navigate, recalculate]);

  const hasData = profileReady;

  // Memoize expensive skill computation
  const dashboardSkills = useMemo(() => {
    const categories = computeSkillCategories(skills, steps);
    const topSkills = getTopSkillsFlat(categories);
    return topSkills.length > 0 && topSkills.some(s => s.level > 0)
      ? topSkills
      : [{ name: 'Complete tasks to build skills', color: '#8B5CF6', colorEnd: '#7C3AED', level: 0 }];
  }, [skills, steps]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-pattern">
        <div className="w-12 h-12 border-4 border-neon-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      {/* ══════ Top Bar ══════ */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center overflow-hidden">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-7 h-7 text-white" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue flex items-center justify-center text-white text-xs font-bold border-2 border-deep-blue-950">
                {stats.level}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Hi, {user?.name?.split(' ')[0] || 'Student'} 👋
              </h1>
              {hasData ? (
                <p className="text-deep-blue-400 text-sm">Your current path: <span className="text-neon-purple-400">{(() => { const g = JSON.parse(localStorage.getItem('sanapath_goals') || '{}'); return g.selectedRoles?.join(' → ') || user?.career_goal || 'Career Explorer'; })()}</span></p>
              ) : (
                <p className="text-deep-blue-400 text-sm">Generate your first project or take the career survey to get started</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StreakCounter streak={stats.streak} />
            <span className="px-3 py-1.5 rounded-full bg-neon-purple-500/20 text-neon-purple-400 text-sm flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <AnimatedCounter value={stats.xp} /> XP
            </span>
          </div>
        </div>
      </motion.div>

      {/* ══════ EMPTY STATE ══════ */}
      {!hasData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {/* Get Started Card */}
          <div className="card-glass p-10 text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-neon-purple-500/20 to-cyber-blue/20 flex items-center justify-center">
              <Rocket className="w-12 h-12 text-neon-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Welcome to SanaPath AI!</h2>
            <p className="text-deep-blue-300 max-w-md mx-auto mb-8">Get started by generating your first AI-powered project or take our career survey to receive personalized recommendations.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/generate-project">
                <motion.button
                  className="flex items-center gap-3 px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-neon-purple-600 to-cyber-blue text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Sparkles className="w-5 h-5" />
                  Generate AI Project
                </motion.button>
              </Link>
              <Link to="/ai-session">
                <motion.button
                  className="flex items-center gap-3 px-8 py-4 rounded-xl font-semibold bg-deep-blue-800 text-white hover:bg-deep-blue-700 transition-all border border-deep-blue-600"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Brain className="w-5 h-5" />
                  Career Survey
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Empty Placeholder Widgets */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-glass p-5">
              <div className="flex items-center gap-2 mb-3 text-deep-blue-500"><Map className="w-4 h-4" /> Roadmap Progress</div>
              <div className="h-2.5 bg-deep-blue-800 rounded-full" />
              <p className="text-xs text-deep-blue-600 mt-2">No roadmap yet — generate your first one</p>
            </div>
            <div className="card-glass p-5">
              <div className="flex items-center gap-2 mb-3 text-deep-blue-500"><CheckCircle2 className="w-4 h-4" /> This Week's Focus</div>
              <p className="text-xs text-deep-blue-600">Generate a project to see tasks</p>
            </div>
            <div className="card-glass p-5">
              <div className="flex items-center gap-2 mb-3 text-deep-blue-500"><Target className="w-4 h-4" /> Skills</div>
              <div className="text-3xl font-bold text-deep-blue-700">—</div>
            </div>
            <div className="card-glass p-5">
              <div className="flex items-center gap-2 mb-3 text-deep-blue-500"><BarChart3 className="w-4 h-4" /> Activity</div>
              <div className="text-3xl font-bold text-deep-blue-700">—</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ══════ FILLED STATE ══════ */}
      {hasData && (
        <div className="space-y-6">
          {/* Row 1 — Big Widgets */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Roadmap Progress — Big */}
            <motion.div className="card-glass p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="text-sm font-medium text-deep-blue-400 mb-4 flex items-center gap-2"><Map className="w-4 h-4 text-neon-purple-400" /> Roadmap Progress</h3>
              <div className="flex items-center gap-6">
                <ProgressRing progress={overallProgress} size={100} strokeWidth={8}>
                  <span className="text-2xl font-bold text-white">{overallProgress}%</span>
                </ProgressRing>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-1">Step {currentStep?.step || 1} of {steps.length}</p>
                  <p className="text-sm text-deep-blue-400 mb-1">{currentStep?.title || 'Getting started'}</p>
                  <p className="text-xs text-deep-blue-500 mb-3">{doneTasks}/{totalTasks} tasks completed</p>
                  <Link to="/roadmap" className="text-sm text-neon-purple-400 hover:text-neon-purple-300 flex items-center gap-1">
                    View Roadmap <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* This Week's Focus */}
            <motion.div className="card-glass p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h3 className="text-sm font-medium text-deep-blue-400 mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-cyber-blue" /> This Week's Focus</h3>
              <div className="space-y-2.5">
                {weekTasks.slice(0, 4).map((t) => (
                  <div key={t.id} className="flex items-center gap-3 group">
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                        t.status === 'done' ? 'bg-green-500 border-green-500' : 'border-deep-blue-600 group-hover:border-neon-purple-500'
                      }`}
                      onClick={() => toggleTaskStatus(t.id)}
                    >
                      {t.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-sm flex-1 ${t.status === 'done' ? 'text-deep-blue-500 line-through' : 'text-white'}`}>{t.title}</span>
                    {t.status !== 'done' ? (
                      <button
                        onClick={() => toggleTaskStatus(t.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-green-500/15 text-green-400 hover:bg-green-500/25 border border-green-500/20 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </button>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">Done</span>
                    )}
                  </div>
                ))}
                {weekTasks.length === 0 && <p className="text-xs text-deep-blue-500">No tasks this week</p>}
              </div>
              <Link to="/tasks" className="mt-4 block text-sm text-neon-purple-400 hover:text-neon-purple-300 flex items-center gap-1">
                All tasks <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            {/* Next Milestones */}
            <motion.div className="card-glass p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="text-sm font-medium text-deep-blue-400 mb-4 flex items-center gap-2"><Rocket className="w-4 h-4 text-orange-400" /> Milestones</h3>
              <div className="space-y-3">
                {steps.slice(0, 5).map((s) => {
                  const stepTaskCount = (s.tasks || []).length;
                  const stepDoneCount = (s.tasks || []).filter(t => t.status === 'done').length;
                  return (
                  <div key={s.step} className={`flex items-center gap-3 p-2.5 rounded-lg ${
                    s._status === 'in-progress' ? 'bg-neon-purple-500/10 border border-neon-purple-500/30' : 'bg-deep-blue-800/30'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      s._status === 'completed' ? 'bg-green-500 text-white'
                        : s._status === 'in-progress' ? 'bg-gradient-to-br from-neon-purple-500 to-cyber-blue text-white'
                        : 'bg-deep-blue-700 text-deep-blue-500'
                    }`}>
                      {s._status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${s._status === 'locked' ? 'text-deep-blue-500' : 'text-white'}`}>{s.title.split(':')[0]}</span>
                        {stepTaskCount > 0 && (
                          <span className="text-[10px] text-deep-blue-500 ml-2 flex-shrink-0">
                            {stepDoneCount}/{stepTaskCount}
                          </span>
                        )}
                      </div>
                      {s._progress > 0 && s._status !== 'completed' && (
                        <div className="w-full h-1 rounded-full bg-deep-blue-800 mt-1 overflow-hidden">
                          <div className="h-full bg-neon-purple-400 rounded-full" style={{ width: `${s._progress}%` }} />
                        </div>
                      )}
                      {s._status === 'completed' && (
                        <div className="w-full h-1 rounded-full bg-green-500/30 mt-1 overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full w-full" />
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Row 2 — GitHub / LinkedIn / Streak / XP */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* GitHub Health */}
            <motion.div className="card-glass p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              {(() => {
                const repos = activeProjects.length;
                const hasTests = doneTasks > 3;
                const ghScore = Math.min(Math.round((repos * 15) + (doneTasks * 3) + (stats.streak > 0 ? 10 : 0)), 100);
                return (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-deep-blue-400 flex items-center gap-1.5"><Github className="w-4 h-4" /> GitHub Health</span>
                      <span className="text-xl font-bold text-green-400">{ghScore}%</span>
                    </div>
                    <div className="h-2 bg-deep-blue-800 rounded-full overflow-hidden mb-3">
                      <motion.div className="h-full bg-green-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${ghScore}%` }} transition={{ duration: 1 }} />
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-deep-blue-400"><span>Repos</span><span className="text-white">{repos}</span></div>
                      <div className="flex justify-between text-deep-blue-400"><span>Tasks Done</span><span className="text-white">{doneTasks}</span></div>
                      <div className="flex justify-between text-deep-blue-400"><span>Activity</span><span className={stats.streak > 0 ? 'text-green-400' : 'text-yellow-400'}>{stats.streak > 0 ? 'Active' : 'Inactive'}</span></div>
                      <div className="flex justify-between text-deep-blue-400"><span>Tests</span><span className={hasTests ? 'text-green-400' : 'text-yellow-400'}>{hasTests ? 'Good' : 'Needs work'}</span></div>
                    </div>
                  </>
                );
              })()}
            </motion.div>

            {/* LinkedIn Visibility */}
            <motion.div className="card-glass p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              {(() => {
                const liTasks = weekTasks.filter(t => t.tags?.some(tag => tag === 'LinkedIn' || tag === 'Career'));
                const liDone = liTasks.filter(t => t.status === 'done').length;
                const hasProjects = activeProjects.length > 0;
                const liScore = Math.min(Math.round(20 + (liDone * 15) + (hasProjects ? 15 : 0) + (overallProgress * 0.3)), 100);
                return (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-deep-blue-400 flex items-center gap-1.5"><Linkedin className="w-4 h-4" /> LinkedIn Visibility</span>
                      <span className="text-xl font-bold text-[#0077B5]">{liScore}%</span>
                    </div>
                    <div className="h-2 bg-deep-blue-800 rounded-full overflow-hidden mb-3">
                      <motion.div className="h-full bg-[#0077B5] rounded-full" initial={{ width: 0 }} animate={{ width: `${liScore}%` }} transition={{ duration: 1 }} />
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 text-deep-blue-400"><CheckCircle2 className={`w-3 h-3 ${hasProjects ? 'text-green-400' : 'text-yellow-400'}`} /> {hasProjects ? 'Projects added' : 'Add projects to profile'}</div>
                      <div className="flex items-center gap-2 text-deep-blue-400"><CheckCircle2 className={`w-3 h-3 ${liDone > 0 ? 'text-green-400' : 'text-yellow-400'}`} /> {liDone > 0 ? 'LinkedIn tasks started' : 'Optimize headline'}</div>
                      <div className="flex items-center gap-2 text-deep-blue-400"><Clock className={`w-3 h-3 ${overallProgress > 30 ? 'text-green-400' : 'text-yellow-400'}`} /> {overallProgress > 30 ? 'Skills demonstrated' : 'Complete more tasks'}</div>
                    </div>
                  </>
                );
              })()}
            </motion.div>

            {/* Streak */}
            <motion.div className="card-glass p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <div className="text-sm text-deep-blue-400 mb-2 flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-400" /> Streak</div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-orange-400">{stats.streak}</span>
                <span className="text-deep-blue-400 text-sm pb-1">days in a row</span>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5,6,7].map(w => (
                  <div key={w} className={`flex-1 h-2 rounded-full ${w <= stats.streak ? 'bg-orange-400' : 'bg-deep-blue-700'}`} />
                ))}
              </div>
              <p className="text-xs text-deep-blue-500 mt-2">Keep going! 🔥</p>
            </motion.div>

            {/* Career XP */}
            <motion.div className="card-glass p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="text-sm text-deep-blue-400 mb-2 flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-400" /> Career XP</div>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl font-bold text-white">Level {stats.level}</div>
                <span className="text-deep-blue-400 text-sm">/ 10</span>
              </div>
              <div className="h-2.5 bg-deep-blue-800 rounded-full overflow-hidden mb-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((stats.xp % 500) / 500) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-xs text-deep-blue-400">{stats.xp} / {(stats.level) * 500 + 500} XP</p>
            </motion.div>
          </div>

          {/* Row 3 — Active Projects + Weekly Chart + Skills */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Active Projects */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><Rocket className="w-5 h-5 text-neon-purple-400" /> Active Projects</h3>
                <div className="flex items-center gap-4">
                  <Link to="/generate-project" className="flex items-center gap-1 text-sm text-cyber-blue hover:text-cyber-blue/80">
                    <Brain className="w-4 h-4" /> Custom AI Project
                  </Link>
                  <Link to="/survey" className="flex items-center gap-1 text-sm text-neon-purple-400 hover:text-neon-purple-300">
                    <Plus className="w-4 h-4" /> Take Survey
                  </Link>
                </div>
              </div>

              {activeProjects.length === 0 ? (
                <div className="card-glass p-8 text-center">
                  <Brain className="w-12 h-12 text-neon-purple-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Start your first project</h3>
                  <p className="text-deep-blue-400 mb-4 text-sm">Take our survey or generate a custom project with AI.</p>
                  <div className="flex items-center justify-center gap-4">
                    <Link to="/survey">
                      <motion.button className="btn-primary text-sm" whileHover={{ scale: 1.05 }}>
                        <Zap className="w-4 h-4 mr-2" /> Get Recommendations
                      </motion.button>
                    </Link>
                    <Link to="/generate-project">
                      <motion.button className="px-4 py-2 rounded-lg bg-deep-blue-800 text-white text-sm hover:bg-deep-blue-700 transition-colors flex items-center" whileHover={{ scale: 1.05 }}>
                        <Brain className="w-4 h-4 mr-2" /> Custom Project
                      </motion.button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeProjects.slice(0, 3).map((p, i) => (
                    <Link key={p.id} to={`/project/${p.id}`}>
                      <motion.div
                        className="card-glass p-5 hover:border-neon-purple-500/50 transition-colors cursor-pointer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                p.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {p.status === 'active' ? 'In Progress' : 'Paused'}
                              </span>
                              <span className="text-xs text-deep-blue-500">Week {p.currentWeek || 1}/4</span>
                            </div>
                            <h4 className="text-white font-semibold truncate">{p.title}</h4>
                            <div className="flex gap-1.5 mt-2 flex-wrap">
                              {p.tech_stack?.slice(0, 3).map((t, j) => (
                                <span key={j} className="px-2 py-0.5 rounded bg-deep-blue-800/80 text-xs text-cyber-blue">{t}</span>
                              ))}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-deep-blue-500 flex-shrink-0" />
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Weekly Activity */}
              <motion.div className="card-glass p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h3 className="text-sm font-medium text-deep-blue-400 mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-cyber-blue" /> Weekly Activity</h3>
                <WeeklyProgressChart data={weeklyActivity} />
              </motion.div>
            </div>

            {/* Right Column — Skills + Achievements */}
            <div className="space-y-6">
              <motion.div className="card-glass p-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                <h3 className="text-sm font-medium text-deep-blue-400 mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-cyber-blue" /> Your Skills</h3>
                <SkillBars skills={dashboardSkills} />
                <Link to="/skills" className="mt-4 block text-sm text-neon-purple-400 hover:text-neon-purple-300 flex items-center gap-1">
                  Full skills map <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>

              <motion.div className="card-glass p-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-deep-blue-400 flex items-center gap-2"><Award className="w-4 h-4 text-orange-400" /> Achievements</h3>
                  <button onClick={() => setShowAchievements(true)} className="text-xs text-neon-purple-400 hover:text-neon-purple-300">View All</button>
                </div>
                <div className="space-y-2.5">
                  {allAchievements.filter(a => unlockedAchievementIds.includes(a.id)).slice(0, 3).map((a) => (
                    <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-deep-blue-800/30">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center`}>
                        <a.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{a.title}</p>
                        <p className="text-xs text-deep-blue-500">+{a.points} XP</p>
                      </div>
                    </div>
                  ))}
                  {unlockedAchievementIds.length === 0 && (
                    <p className="text-xs text-deep-blue-500 text-center py-2">Complete tasks to unlock achievements</p>
                  )}
                </div>
              </motion.div>

              {/* AI Insight */}
              <div className="card-glass p-4 bg-gradient-to-r from-neon-purple-500/10 to-cyber-blue/10">
                <p className="text-xs font-medium text-neon-purple-400 mb-1">💡 AI Tip</p>
                <p className="text-sm text-deep-blue-200 leading-relaxed">
                  {overallProgress === 0
                    ? "Start by completing your first task. Small wins build big momentum! 🏁"
                    : overallProgress < 30
                      ? `You've completed ${doneTasks} of ${totalTasks} tasks — great start! Focus on finishing the current step.`
                      : overallProgress < 60
                        ? `${overallProgress}% done! You're building real skills. Keep the streak alive! 🔥`
                        : overallProgress < 90
                          ? "You're in the home stretch! Consider starting your portfolio project now. 💼"
                          : "Almost there! Review everything and polish your portfolio for job applications. 🚀"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Modal */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAchievements(false)}>
            <motion.div className="w-full max-w-3xl max-h-[80vh] overflow-auto card-glass rounded-2xl p-6" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Award className="w-6 h-6 text-orange-400" /> All Achievements</h2>
                <button onClick={() => setShowAchievements(false)} className="p-2 rounded-lg hover:bg-deep-blue-700 text-deep-blue-400 hover:text-white">✕</button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allAchievements.map(a => <AchievementCard key={a.id} achievement={a} isUnlocked={unlockedAchievementIds.includes(a.id)} />)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Dashboard;
