import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGlobalNotifications } from '../context/NotificationContext';
import { NotificationCenter } from './NotificationCenter';
import { 
  BrainCircuit, 
  Menu, 
  X, 
  Github,
  Twitter,
  Linkedin,
  LogOut,
  User,
  LayoutDashboard,
  Bell,
  Settings,
  Trophy,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, dismissNotification, markAsRead, clearAll } = useGlobalNotifications();

  // Navigation links - Dashboard shown only for authenticated users
  const navLinks = isAuthenticated 
    ? [
        { name: 'Home', href: '/' },
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Survey', href: '/survey' },
        { name: 'Community', href: '/community' },
      ]
    : [
        { name: 'Home', href: '/' },
        { name: 'Survey', href: '/survey' },
        { name: 'Community', href: '/community' },
      ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-deep-blue-950/80 backdrop-blur-xl border-b border-deep-blue-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-neon-purple-500 to-cyber-blue group-hover:shadow-lg group-hover:shadow-neon-purple-500/25 transition-all">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-white">Sana</span>
              <span className="gradient-text">Path</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-deep-blue-200 hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-purple-500 to-cyber-blue group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3 mr-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-deep-blue-400 hover:text-neon-purple-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-deep-blue-400 hover:text-neon-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-deep-blue-400 hover:text-neon-purple-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-lg hover:bg-deep-blue-800/50 transition-colors text-deep-blue-300 hover:text-white"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-pink text-white text-xs rounded-full flex items-center justify-center font-bold"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </motion.span>
                    )}
                  </button>
                  
                  <NotificationCenter
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                    notifications={notifications}
                    onDismiss={dismissNotification}
                    onRead={markAsRead}
                    onClearAll={clearAll}
                  />
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-deep-blue-800/50 transition-colors"
                  >
                    {user?.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full border-2 border-neon-purple-500"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="text-white font-medium">{user?.name || 'User'}</span>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 card-glass rounded-xl overflow-hidden shadow-xl"
                      >
                        <div className="p-4 border-b border-deep-blue-700 bg-gradient-to-r from-neon-purple-500/10 to-cyber-blue/10">
                          <div className="flex items-center gap-3">
                            {user?.avatar_url ? (
                              <img src={user.avatar_url} alt={user.name} className="w-10 h-10 rounded-full" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                            )}
                            <div>
                              <p className="text-white font-medium">{user?.name || 'User'}</p>
                              <p className="text-xs text-deep-blue-400 truncate">{user?.email}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <div className="px-2 py-1 rounded-full bg-neon-purple-500/20 text-neon-purple-400 text-xs flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>1,250 XP</span>
                            </div>
                            <div className="px-2 py-1 rounded-full bg-cyber-blue/20 text-cyber-blue text-xs flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              <span>Level 3</span>
                            </div>
                          </div>
                        </div>
                        <div className="py-2">
                          <Link
                            to="/dashboard"
                            onClick={() => setShowUserMenu(false)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-deep-blue-200 hover:text-white hover:bg-deep-blue-800/50 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-deep-blue-200 hover:text-white hover:bg-deep-blue-800/50 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            to="/settings"
                            onClick={() => setShowUserMenu(false)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-deep-blue-200 hover:text-white hover:bg-deep-blue-800/50 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>
                        </div>
                        <div className="py-2 border-t border-deep-blue-700">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-deep-blue-200 hover:text-cyber-pink hover:bg-deep-blue-800/50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <button className="px-4 py-2 bg-gradient-to-r from-neon-purple-500 to-cyber-blue text-white font-medium rounded-lg hover:shadow-lg hover:shadow-neon-purple-500/25 transition-all">
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-deep-blue-200 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-deep-blue-900/95 backdrop-blur-xl border-b border-deep-blue-800"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block py-2 text-deep-blue-200 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 py-2 border-t border-deep-blue-700 mt-2 pt-4">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="text-white">{user?.name}</span>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center gap-2 py-2 text-deep-blue-200 hover:text-white"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full flex items-center gap-2 py-2 text-deep-blue-200 hover:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-neon-purple-500 to-cyber-blue text-white font-medium rounded-lg">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
