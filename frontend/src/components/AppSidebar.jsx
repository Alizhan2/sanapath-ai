import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useRealStats } from '../hooks/useRealStats';
import {
  LayoutDashboard,
  Map,
  CheckSquare,
  ClipboardList,
  Sparkles,
  Briefcase,
  Settings,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  Flame,
  LogOut
} from 'lucide-react';

const sidebarLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Roadmap', href: '/roadmap', icon: Map },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'AI Session', href: '/ai-session', icon: MessageCircle },
  { name: 'Surveys', href: '/weekly-checkin', icon: ClipboardList },
  { name: 'Skills', href: '/skills', icon: Sparkles },
  { name: 'Portfolio', href: '/portfolio', icon: Briefcase },
  { name: 'Goals & Settings', href: '/goals', icon: Settings },
];

const AppSidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { stats } = useRealStats();

  return (
    <motion.aside
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-deep-blue-950/95 backdrop-blur-xl border-r border-deep-blue-800/50"
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-deep-blue-800/50">
        <Link to="/" className="flex items-center gap-2 overflow-hidden">
          <div className="flex-shrink-0 p-2 rounded-xl bg-gradient-to-br from-neon-purple-500 to-cyber-blue">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-lg font-bold whitespace-nowrap"
              >
                <span className="text-white">Sana</span>
                <span className="gradient-text">Path</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* User Mini Profile */}
      <div className={`px-3 py-4 border-b border-deep-blue-800/50 ${collapsed ? 'items-center' : ''}`}>
        <div className={`flex ${collapsed ? 'justify-center' : 'items-center gap-3'}`}>
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-deep-blue-950" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name?.split(' ')[0] || 'Student'}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-neon-purple-400 flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Lvl {stats.level}
                  </span>
                  <span className="text-xs text-orange-400 flex items-center gap-1">
                    <Flame className="w-3 h-3" /> {stats.streak}d
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* XP Bar */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3"
          >
            <div className="flex justify-between text-xs text-deep-blue-400 mb-1">
              <span>{stats.xp} XP</span>
              <span>{500 - (stats.xp % 500)} to next</span>
            </div>
            <div className="h-1.5 bg-deep-blue-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue rounded-full transition-all duration-500"
                style={{ width: `${((stats.xp % 500) / 500) * 100}%` }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <Link key={link.href} to={link.href}>
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                  isActive
                    ? 'bg-neon-purple-500/20 text-white'
                    : 'text-deep-blue-400 hover:text-white hover:bg-deep-blue-800/50'
                }`}
                whileHover={{ x: 2 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-neon-purple-500 to-cyber-blue rounded-r-full"
                  />
                )}
                <link.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-neon-purple-400' : ''}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {link.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-deep-blue-800 text-white text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                    {link.name}
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 py-3 border-t border-deep-blue-800/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-deep-blue-400 hover:text-white hover:bg-deep-blue-800/50 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default AppSidebar;
