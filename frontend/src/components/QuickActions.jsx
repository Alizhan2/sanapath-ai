import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Users,
  BookOpen,
  Trophy,
  Settings,
  HelpCircle,
  MessageSquare,
  FileText,
  Zap,
  Download
} from 'lucide-react';

const QuickAction = ({ icon: Icon, title, description, href, color, onClick }) => {
  const Component = href ? Link : 'button';
  
  return (
    <Component 
      to={href}
      onClick={onClick}
      className="block"
    >
      <motion.div
        className="p-4 rounded-xl bg-deep-blue-800/30 border border-deep-blue-700/50 hover:border-neon-purple-500/30 transition-all group cursor-pointer"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-shadow`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-white group-hover:text-neon-purple-300 transition-colors">
              {title}
            </h4>
            <p className="text-sm text-deep-blue-400 mt-0.5">{description}</p>
          </div>
        </div>
      </motion.div>
    </Component>
  );
};

const QuickActions = () => {
  const handleExport = () => {
    const projects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    const stats = JSON.parse(localStorage.getItem('sanapath_goals') || '{}');
    const checkins = JSON.parse(localStorage.getItem('sanapath_checkins') || '[]');
    const exportData = {
      exportedAt: new Date().toISOString(),
      projects: projects.map(p => ({ title: p.title, status: p.status, tech: p.tech_stack || p.tech })),
      goals: stats,
      checkinCount: checkins.length,
      totalHoursStudied: checkins.reduce((s, c) => s + (c.hours || 0), 0),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sanapath-progress.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const actions = [
    {
      icon: Plus,
      title: 'New Project',
      description: 'Start a personalized AI project',
      href: '/survey',
      color: 'from-neon-purple-500 to-cyber-blue'
    },
    {
      icon: Users,
      title: 'Find Team',
      description: 'Join community projects',
      href: '/community',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: BookOpen,
      title: 'Skills Map',
      description: 'View your skill progress',
      href: '/skills',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Trophy,
      title: 'Achievements',
      description: 'View your badges & XP',
      href: '/dashboard#achievements',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: MessageSquare,
      title: 'AI Assistant',
      description: 'Get help with your project',
      href: '/ai-session',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Download,
      title: 'Export Progress',
      description: 'Download your data as JSON',
      onClick: handleExport,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <QuickAction {...action} />
        </motion.div>
      ))}
    </div>
  );
};

// Compact version for sidebar
export const QuickActionsCompact = () => {
  const actions = [
    { icon: Plus, title: 'New Project', href: '/survey', color: 'from-neon-purple-500 to-cyber-blue' },
    { icon: Users, title: 'Community', href: '/community', color: 'from-pink-500 to-rose-500' },
    { icon: Trophy, title: 'Achievements', href: '#', color: 'from-yellow-500 to-orange-500' },
    { icon: Settings, title: 'Settings', href: '/profile', color: 'from-gray-500 to-slate-500' }
  ];

  return (
    <div className="flex gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.title} to={action.href}>
            <motion.div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center hover:shadow-lg transition-shadow`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={action.title}
            >
              <Icon className="w-5 h-5 text-white" />
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
};

// Floating Action Button
export const FloatingActionButton = ({ onClick }) => {
  return (
    <motion.button
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center shadow-lg shadow-neon-purple-500/25 z-30"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', delay: 0.5 }}
    >
      <Zap className="w-6 h-6 text-white" />
    </motion.button>
  );
};

export default QuickActions;
