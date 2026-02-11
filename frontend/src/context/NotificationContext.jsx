import { createContext, useContext } from 'react';
import { useNotifications } from '../components/NotificationCenter';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const notificationState = useNotifications();

  // Helper to send task completion notification
  const notifyTaskComplete = (taskName, xpEarned = 10) => {
    notificationState.addNotification({
      type: 'success',
      title: '✅ Task Completed!',
      message: `"${taskName}" is done! +${xpEarned} XP earned.`
    });
  };

  // Helper to send achievement unlocked notification
  const notifyAchievement = (achievementTitle, points) => {
    notificationState.addNotification({
      type: 'achievement',
      title: '🏆 Achievement Unlocked!',
      message: `You earned "${achievementTitle}"! +${points} XP`
    });
  };

  // Helper to send project started notification
  const notifyProjectStarted = (projectTitle) => {
    notificationState.addNotification({
      type: 'project',
      title: '🚀 Project Started!',
      message: `You've started "${projectTitle}". Good luck!`
    });
  };

  // Helper to send week completed notification
  const notifyWeekComplete = (weekNumber, projectTitle) => {
    notificationState.addNotification({
      type: 'success',
      title: `📅 Week ${weekNumber} Complete!`,
      message: `Great progress on "${projectTitle}"! Keep going!`
    });
  };

  // Helper to send LinkedIn post notification
  const notifyLinkedInPost = (projectTitle) => {
    notificationState.addNotification({
      type: 'info',
      title: '📣 LinkedIn Post Ready!',
      message: `Post about "${projectTitle}" copied! Paste it on LinkedIn.`
    });
  };

  const value = {
    ...notificationState,
    notifyTaskComplete,
    notifyAchievement,
    notifyProjectStarted,
    notifyWeekComplete,
    notifyLinkedInPost
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useGlobalNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useGlobalNotifications must be used within NotificationProvider');
  }
  return context;
};
