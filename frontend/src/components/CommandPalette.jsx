import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Command, LayoutDashboard, Map, CheckSquare,
  Zap, Briefcase, Target, BarChart3, Settings, User,
  Award, Users, Brain, Calendar, ArrowRight, X
} from 'lucide-react';

const PAGES = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, keywords: 'home main overview' },
  { name: 'Roadmap', path: '/roadmap', icon: Map, keywords: 'roadmap steps career path' },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare, keywords: 'tasks todo checklist' },
  { name: 'Skills Map', path: '/skills', icon: Zap, keywords: 'skills tech abilities' },
  { name: 'Portfolio', path: '/portfolio', icon: Briefcase, keywords: 'portfolio projects showcase' },
  { name: 'Goals', path: '/goals', icon: Target, keywords: 'goals objectives targets' },
  { name: 'Weekly Check-in', path: '/weekly-checkin', icon: Calendar, keywords: 'weekly checkin reflection' },
  { name: 'AI Session', path: '/ai-session', icon: Brain, keywords: 'ai chat assistant mentor' },
  { name: 'Community', path: '/community', icon: Users, keywords: 'community peers social' },
  { name: 'Leaderboard', path: '/leaderboard', icon: BarChart3, keywords: 'leaderboard ranking top' },
  { name: 'Profile', path: '/profile', icon: User, keywords: 'profile account me' },
  { name: 'Settings', path: '/settings', icon: Settings, keywords: 'settings preferences config' },
  { name: 'Achievements', path: '/dashboard', icon: Award, keywords: 'achievements badges trophies' },
  { name: 'New Project', path: '/survey', icon: Brain, keywords: 'new project survey recommendations' },
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Cmd/Ctrl + K to toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = query.trim()
    ? PAGES.filter(p =>
        `${p.name} ${p.keywords}`.toLowerCase().includes(query.toLowerCase())
      )
    : PAGES;

  const handleSelect = useCallback((page) => {
    navigate(page.path);
    setOpen(false);
  }, [navigate]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-lg card-glass rounded-2xl overflow-hidden shadow-2xl shadow-neon-purple-500/10 border border-deep-blue-700/50"
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-deep-blue-800/50">
              <Search className="w-5 h-5 text-deep-blue-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Search pages, actions..."
                className="flex-1 bg-transparent text-white placeholder-deep-blue-500 outline-none text-sm"
              />
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-deep-blue-800/60 text-deep-blue-400 text-xs border border-deep-blue-700/50">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <p className="text-deep-blue-500 text-sm">No results for "{query}"</p>
                </div>
              )}
              {filtered.map((page, i) => {
                const Icon = page.icon;
                const isSelected = i === selectedIndex;
                return (
                  <button
                    key={page.path + page.name}
                    onClick={() => handleSelect(page)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                      isSelected
                        ? 'bg-neon-purple-500/15 text-white'
                        : 'text-deep-blue-300 hover:bg-deep-blue-800/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-neon-purple-500/20' : 'bg-deep-blue-800/50'
                    }`}>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-neon-purple-400' : 'text-deep-blue-400'}`} />
                    </div>
                    <span className="flex-1 text-sm font-medium">{page.name}</span>
                    {isSelected && <ArrowRight className="w-4 h-4 text-neon-purple-400" />}
                  </button>
                );
              })}
            </div>

            {/* Footer hint */}
            <div className="px-5 py-3 border-t border-deep-blue-800/50 flex items-center gap-4 text-xs text-deep-blue-500">
              <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-deep-blue-800/60 border border-deep-blue-700/50">↑↓</kbd> Navigate</span>
              <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-deep-blue-800/60 border border-deep-blue-700/50">↵</kbd> Open</span>
              <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-deep-blue-800/60 border border-deep-blue-700/50">Esc</kbd> Close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
