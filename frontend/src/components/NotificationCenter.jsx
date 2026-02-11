import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Trophy,
  Rocket,
  Users,
  Calendar,
  Gift
} from 'lucide-react';

const notificationIcons = {
  success: CheckCircle2,
  warning: AlertCircle,
  info: Info,
  achievement: Trophy,
  project: Rocket,
  community: Users,
  reminder: Calendar,
  reward: Gift
};

const notificationColors = {
  success: 'from-green-500 to-emerald-500',
  warning: 'from-yellow-500 to-orange-500',
  info: 'from-blue-500 to-cyan-500',
  achievement: 'from-yellow-500 to-amber-500',
  project: 'from-neon-purple-500 to-cyber-blue',
  community: 'from-pink-500 to-rose-500',
  reminder: 'from-indigo-500 to-purple-500',
  reward: 'from-amber-500 to-yellow-500'
};

const NotificationItem = ({ notification, onDismiss, onRead }) => {
  const Icon = notificationIcons[notification.type] || Info;
  const colorClass = notificationColors[notification.type] || notificationColors.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      className={`relative p-4 rounded-xl border backdrop-blur-xl transition-all cursor-pointer ${
        notification.read 
          ? 'bg-deep-blue-900/30 border-deep-blue-700/30' 
          : 'bg-deep-blue-800/50 border-neon-purple-500/30 shadow-lg shadow-neon-purple-500/10'
      }`}
      onClick={() => onRead(notification.id)}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-neon-purple-500 animate-pulse" />
      )}

      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm ${notification.read ? 'text-deep-blue-300' : 'text-white'}`}>
            {notification.title}
          </h4>
          <p className={`text-sm mt-0.5 ${notification.read ? 'text-deep-blue-500' : 'text-deep-blue-300'}`}>
            {notification.message}
          </p>
          <p className="text-xs text-deep-blue-500 mt-1">{notification.time}</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(notification.id);
          }}
          className="p-1 hover:bg-deep-blue-700/50 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-deep-blue-400" />
        </button>
      </div>

      {notification.action && (
        <motion.button
          className="mt-3 w-full py-2 px-3 rounded-lg bg-deep-blue-700/50 text-sm text-deep-blue-200 hover:bg-deep-blue-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            notification.action.onClick();
          }}
        >
          {notification.action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

const NotificationCenter = ({ isOpen, onClose, notifications, onDismiss, onRead, onClearAll }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-deep-blue-950/95 backdrop-blur-xl border-l border-deep-blue-800 z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-deep-blue-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-neon-purple-400" />
                <h2 className="text-lg font-semibold text-white">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-neon-purple-500/20 text-neon-purple-400 text-xs font-medium">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-sm text-deep-blue-400 hover:text-white transition-colors"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-deep-blue-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-deep-blue-400" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onDismiss={onDismiss}
                      onRead={onRead}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Bell className="w-12 h-12 text-deep-blue-600 mx-auto mb-3" />
                    <p className="text-deep-blue-400">No notifications yet</p>
                    <p className="text-sm text-deep-blue-500 mt-1">
                      We'll notify you about important updates
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load notifications from localStorage
    const saved = localStorage.getItem('notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      // Demo notifications
      setNotifications([
        {
          id: '1',
          type: 'achievement',
          title: '🏆 Achievement Unlocked!',
          message: 'You earned "First Launch" badge! +100 XP',
          time: '2 minutes ago',
          read: false
        },
        {
          id: '2',
          type: 'project',
          title: 'Project Update',
          message: 'Your "AI Sentiment Analyzer" project has a new task available.',
          time: '1 hour ago',
          read: false
        },
        {
          id: '3',
          type: 'community',
          title: 'New Collaboration Request',
          message: 'Sarah Chen wants to join your project team.',
          time: '3 hours ago',
          read: true
        },
        {
          id: '4',
          type: 'reminder',
          title: 'Weekly Reminder',
          message: "Don't forget to complete this week's tasks!",
          time: 'Yesterday',
          read: true
        }
      ]);
    }
  }, []);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      time: 'Just now',
      read: false,
      ...notification
    };
    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const dismissNotification = (id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAsRead = (id) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    dismissNotification,
    markAsRead,
    clearAll
  };
};

export { NotificationCenter };
export default NotificationCenter;
