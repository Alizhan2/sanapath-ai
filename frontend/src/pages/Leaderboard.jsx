import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Trophy, Crown, Medal, Star, Flame, TrendingUp, Users,
  ArrowLeft, Sparkles, Award, ChevronUp, Zap
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useRealStats } from '../hooks/useRealStats';

// Demo leaderboard data (simulates other students)
const generateLeaderboard = (currentUser, currentStats) => {
  const demoUsers = [
    { name: 'Aisultan K.', avatar: null, xp: 4850, level: 10, streak: 21, projects: 8, tasks: 67, badge: '🏆' },
    { name: 'Dinara M.', avatar: null, xp: 4200, level: 9, streak: 15, projects: 7, tasks: 58, badge: '🥈' },
    { name: 'Nursultan B.', avatar: null, xp: 3600, level: 8, streak: 12, projects: 6, tasks: 49, badge: '🥉' },
    { name: 'Aigerim T.', avatar: null, xp: 3100, level: 7, streak: 9, projects: 5, tasks: 42, badge: '⭐' },
    { name: 'Daulet S.', avatar: null, xp: 2750, level: 6, streak: 14, projects: 5, tasks: 37, badge: '⭐' },
    { name: 'Madina R.', avatar: null, xp: 2400, level: 5, streak: 7, projects: 4, tasks: 31, badge: '⭐' },
    { name: 'Alikhan Z.', avatar: null, xp: 2100, level: 5, streak: 5, projects: 4, tasks: 28, badge: '' },
    { name: 'Kamila N.', avatar: null, xp: 1800, level: 4, streak: 8, projects: 3, tasks: 24, badge: '' },
    { name: 'Yerlan A.', avatar: null, xp: 1500, level: 4, streak: 3, projects: 3, tasks: 20, badge: '' },
    { name: 'Saltanat O.', avatar: null, xp: 1200, level: 3, streak: 6, projects: 2, tasks: 16, badge: '' },
    { name: 'Temirlan K.', avatar: null, xp: 900, level: 2, streak: 2, projects: 2, tasks: 12, badge: '' },
    { name: 'Zhanna P.', avatar: null, xp: 600, level: 2, streak: 1, projects: 1, tasks: 8, badge: '' },
    { name: 'Askar D.', avatar: null, xp: 350, level: 1, streak: 1, projects: 1, tasks: 5, badge: '' },
    { name: 'Moldir E.', avatar: null, xp: 150, level: 1, streak: 0, projects: 1, tasks: 2, badge: '' },
  ];

  // Add current user
  const me = {
    name: currentUser?.name || 'You',
    avatar: currentUser?.avatar_url || null,
    xp: currentStats.xp,
    level: currentStats.level,
    streak: currentStats.streak,
    projects: currentStats.totalProjects,
    tasks: currentStats.completedTasks,
    badge: '',
    isCurrentUser: true
  };

  const all = [...demoUsers, me].sort((a, b) => b.xp - a.xp);
  
  // Assign ranks and badges
  return all.map((u, i) => ({
    ...u,
    rank: i + 1,
    badge: i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : i < 6 ? '⭐' : ''
  }));
};

const getRankColor = (rank) => {
  if (rank === 1) return 'from-yellow-500 to-amber-500';
  if (rank === 2) return 'from-gray-300 to-gray-400';
  if (rank === 3) return 'from-orange-600 to-orange-700';
  return 'from-deep-blue-600 to-deep-blue-700';
};

const Leaderboard = () => {
  const { user } = useAuth();
  const { stats } = useRealStats();
  const [leaderboard, setLeaderboard] = useState([]);
  const [filter, setFilter] = useState('xp');

  useEffect(() => {
    const lb = generateLeaderboard(user, stats);
    setLeaderboard(lb);
  }, [user, stats]);

  const sorted = [...leaderboard].sort((a, b) => {
    if (filter === 'xp') return b.xp - a.xp;
    if (filter === 'streak') return b.streak - a.streak;
    if (filter === 'tasks') return b.tasks - a.tasks;
    if (filter === 'projects') return b.projects - a.projects;
    return 0;
  }).map((u, i) => ({ ...u, rank: i + 1 }));

  const myRank = sorted.findIndex(u => u.isCurrentUser) + 1;

  return (
    <div className="min-h-screen bg-hero-pattern">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-deep-blue-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  Leaderboard
                </h1>
                <p className="text-deep-blue-400 mt-1">Compete with 60,000+ students in the AI-Sana ecosystem</p>
              </div>

              {/* Your rank badge */}
              <div className="card-glass px-5 py-3 flex items-center gap-3">
                <div className="text-center">
                  <p className="text-xs text-deep-blue-400">Your Rank</p>
                  <p className="text-2xl font-bold text-white">#{myRank || '-'}</p>
                </div>
                <div className="w-px h-10 bg-deep-blue-700" />
                <div className="text-center">
                  <p className="text-xs text-deep-blue-400">XP</p>
                  <p className="text-lg font-bold text-neon-purple-400">{stats.xp.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Top 3 Podium */}
          <motion.div
            className="grid grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {[1, 0, 2].map((podiumIndex) => {
              const u = sorted[podiumIndex];
              if (!u) return <div key={podiumIndex} />;
              const heights = ['h-32', 'h-40', 'h-28'];
              const order = [1, 0, 2];
              const podiumHeight = heights[order[podiumIndex]];

              return (
                <motion.div
                  key={podiumIndex}
                  className={`flex flex-col items-center justify-end ${podiumIndex === 1 ? 'order-first md:order-none' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + podiumIndex * 0.1 }}
                >
                  {/* Avatar */}
                  <div className={`relative mb-3 ${podiumIndex === 1 ? 'scale-110' : ''}`}>
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRankColor(u.rank)} flex items-center justify-center text-white text-xl font-bold shadow-lg ${u.isCurrentUser ? 'ring-2 ring-cyber-blue ring-offset-2 ring-offset-deep-blue-950' : ''}`}>
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        u.name.charAt(0)
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 text-2xl">{u.badge}</div>
                  </div>
                  <p className={`text-sm font-semibold mb-1 ${u.isCurrentUser ? 'text-cyber-blue' : 'text-white'}`}>
                    {u.isCurrentUser ? 'You' : u.name}
                  </p>
                  <p className="text-xs text-neon-purple-400 mb-2">{u.xp.toLocaleString()} XP</p>

                  {/* Podium bar */}
                  <div className={`w-full ${podiumHeight} rounded-t-xl bg-gradient-to-t ${getRankColor(u.rank)} flex items-start justify-center pt-3`}>
                    <span className="text-white font-bold text-lg">#{u.rank}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {[
              { key: 'xp', label: 'XP', icon: Sparkles },
              { key: 'streak', label: 'Streak', icon: Flame },
              { key: 'tasks', label: 'Tasks Done', icon: Zap },
              { key: 'projects', label: 'Projects', icon: Award },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f.key
                    ? 'bg-gradient-to-r from-neon-purple-500 to-cyber-blue text-white shadow-lg'
                    : 'bg-deep-blue-800/50 text-deep-blue-400 hover:text-white border border-deep-blue-700/50'
                }`}
              >
                <f.icon className="w-4 h-4" />
                {f.label}
              </button>
            ))}
          </div>

          {/* Full Ranking List */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {sorted.map((u, i) => (
              <motion.div
                key={i}
                className={`card-glass p-4 flex items-center gap-4 transition-all ${
                  u.isCurrentUser 
                    ? 'border-cyber-blue/50 bg-cyber-blue/5 ring-1 ring-cyber-blue/30' 
                    : 'hover:border-deep-blue-600/50'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                {/* Rank */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                  u.rank <= 3 
                    ? `bg-gradient-to-br ${getRankColor(u.rank)} text-white` 
                    : 'bg-deep-blue-800/50 text-deep-blue-400'
                }`}>
                  {u.rank <= 3 ? u.badge : `#${u.rank}`}
                </div>

                {/* User info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${u.rank <= 5 ? 'from-neon-purple-500 to-cyber-blue' : 'from-deep-blue-600 to-deep-blue-700'} flex items-center justify-center text-white font-semibold flex-shrink-0 ${u.isCurrentUser ? 'ring-2 ring-cyber-blue' : ''}`}>
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      u.name.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-semibold truncate ${u.isCurrentUser ? 'text-cyber-blue' : 'text-white'}`}>
                      {u.isCurrentUser ? `${u.name} (You)` : u.name}
                    </p>
                    <p className="text-xs text-deep-blue-400">Level {u.level} • {u.projects} projects</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-deep-blue-500">Streak</p>
                    <p className="text-sm font-semibold text-orange-400 flex items-center gap-1">
                      <Flame className="w-3 h-3" />{u.streak}d
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-deep-blue-500">Tasks</p>
                    <p className="text-sm font-semibold text-green-400">{u.tasks}</p>
                  </div>
                </div>

                {/* XP */}
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-neon-purple-400">{u.xp.toLocaleString()}</p>
                  <p className="text-xs text-deep-blue-500">XP</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Info Banner */}
          <motion.div
            className="mt-8 card-glass p-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Users className="w-8 h-8 text-neon-purple-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Climb the Ranks!</h3>
            <p className="text-deep-blue-400 text-sm max-w-lg mx-auto">
              Complete tasks, maintain your streak, and finish projects to earn more XP. 
              Top performers get featured on the community board!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
