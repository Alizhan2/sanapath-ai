import { useState, useEffect, useCallback } from 'react';

// XP Constants
const XP_PER_TASK = 15;
const XP_PER_WEEK_COMPLETE = 100;
const XP_PER_PROJECT_START = 50;
const XP_PER_PROJECT_COMPLETE = 500;
const XP_PER_LEVEL = 500;

/**
 * Hook that calculates real stats from localStorage user data
 */
export const useRealStats = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    completedTasks: 0,
    totalTasks: 0,
    completedWeeks: 0,
    currentWeek: 1,
    streak: 0,
    xp: 0,
    level: 1,
    xpForNextLevel: XP_PER_LEVEL,
    xpProgress: 0,
    joinedCommunity: false,
    resourcesUsed: 0,
  });

  const [skills, setSkills] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState([]);

  const calculateStats = useCallback(() => {
    const savedProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    
    // --- Basic counts ---
    const totalProjects = savedProjects.length;
    const activeProjects = savedProjects.filter(p => p.status !== 'completed').length;
    const completedProjects = savedProjects.filter(p => p.status === 'completed').length;

    // --- Task counts ---
    let completedTasks = 0;
    let totalTasks = 0;
    let completedWeeks = 0;

    savedProjects.forEach(project => {
      const roadmap = project.roadmap || [];
      const ct = project.completedTasks || {};

      roadmap.forEach((week, weekIndex) => {
        const weekTasks = week.tasks || [];
        totalTasks += weekTasks.length;

        let weekCompleted = 0;
        weekTasks.forEach((_, taskIndex) => {
          if (ct[`${weekIndex}-${taskIndex}`]) {
            completedTasks++;
            weekCompleted++;
          }
        });

        if (weekTasks.length > 0 && weekCompleted === weekTasks.length) {
          completedWeeks++;
        }
      });
    });

    // Current week (from most active project)
    const activeProject = savedProjects.find(p => p.status === 'active');
    const currentWeek = activeProject?.currentWeek || 1;

    // --- XP calculation ---
    let xp = 0;
    xp += totalProjects * XP_PER_PROJECT_START;
    xp += completedTasks * XP_PER_TASK;
    xp += completedWeeks * XP_PER_WEEK_COMPLETE;
    xp += completedProjects * XP_PER_PROJECT_COMPLETE;

    // Bonus: check if user visited community
    const communityVisited = localStorage.getItem('communityVisited') === 'true';
    if (communityVisited) xp += 50;

    const level = Math.floor(xp / XP_PER_LEVEL) + 1;
    const xpInCurrentLevel = xp % XP_PER_LEVEL;
    const xpProgress = (xpInCurrentLevel / XP_PER_LEVEL) * 100;

    // --- Day Streak ---
    const streak = calculateStreak();

    // --- Resources used (count unique resource clicks) ---
    const resourceClicks = JSON.parse(localStorage.getItem('resourceClicks') || '[]');
    const resourcesUsed = resourceClicks.length;

    // --- Skills from tech stacks ---
    const skillMap = {};
    const techColors = {
      'Python':           { color: '#FACC15', colorEnd: '#CA8A04' },
      'PyTorch':          { color: '#EE4C2C', colorEnd: '#DE3412' },
      'TensorFlow':       { color: '#FF6F00', colorEnd: '#E65100' },
      'OpenCV':           { color: '#5C3EE8', colorEnd: '#3D2D9E' },
      'FastAPI':          { color: '#009688', colorEnd: '#00796B' },
      'React':            { color: '#61DAFB', colorEnd: '#21A1F1' },
      'JavaScript':       { color: '#F7DF1E', colorEnd: '#C9B616' },
      'TypeScript':       { color: '#3178C6', colorEnd: '#235A9E' },
      'Machine Learning': { color: '#8B5CF6', colorEnd: '#7C3AED' },
      'Deep Learning':    { color: '#06B6D4', colorEnd: '#2563EB' },
      'NLP':              { color: '#4ADE80', colorEnd: '#16A34A' },
      'Computer Vision':  { color: '#F472B6', colorEnd: '#DB2777' },
      'YOLO':             { color: '#00D4AA', colorEnd: '#00A88A' },
      'Streamlit':        { color: '#FF4B4B', colorEnd: '#D63030' },
      'Docker':           { color: '#2496ED', colorEnd: '#1A6FC4' },
      'Scikit-learn':     { color: '#F09437', colorEnd: '#D07D2B' },
      'Pandas':           { color: '#130654', colorEnd: '#2D1B8E' },
      'NumPy':            { color: '#4DABCF', colorEnd: '#3A8FB2' },
      'Hugging Face':     { color: '#FFD21E', colorEnd: '#CCAA18' },
      'OpenAI API':       { color: '#10A37F', colorEnd: '#0D8A6A' },
      'GitHub Actions':   { color: '#2088FF', colorEnd: '#1A6FCC' },
      'Node.js':          { color: '#339933', colorEnd: '#2B802B' },
      'Flask':            { color: '#000000', colorEnd: '#333333' },
      'MongoDB':          { color: '#47A248', colorEnd: '#3B8A3B' },
      'PostgreSQL':       { color: '#336791', colorEnd: '#2A5577' },
    };
    const defaultColor = { color: '#8B5CF6', colorEnd: '#7C3AED' };

    savedProjects.forEach(project => {
      const roadmap = project.roadmap || [];
      const ct = project.completedTasks || {};
      const totalProjectTasks = roadmap.reduce((a, w) => a + (w.tasks?.length || 0), 0);
      const completedProjectTasks = Object.values(ct).filter(Boolean).length;
      const projectProgress = totalProjectTasks > 0 ? completedProjectTasks / totalProjectTasks : 0;

      (project.tech_stack || []).forEach(tech => {
        if (!skillMap[tech]) {
          skillMap[tech] = { totalWeight: 0, count: 0 };
        }
        // Skill level = weighted by project progress (0-100)
        skillMap[tech].totalWeight += projectProgress;
        skillMap[tech].count += 1;
      });

      // Also add tag-based skills
      (project.tags || []).forEach(tag => {
        if (!skillMap[tag]) {
          skillMap[tag] = { totalWeight: 0, count: 0 };
        }
        skillMap[tag].totalWeight += projectProgress * 0.5;
        skillMap[tag].count += 1;
      });
    });

    const calculatedSkills = Object.entries(skillMap)
      .map(([name, data]) => {
        // Base level: 20% for starting a project + up to 80% based on progress
        const baseLevel = Math.min(20 * data.count, 40);
        const progressLevel = Math.round((data.totalWeight / data.count) * 60);
        const level = Math.min(baseLevel + progressLevel, 100);
        const colors = techColors[name] || defaultColor;
        return { name, level, ...colors };
      })
      .sort((a, b) => b.level - a.level)
      .slice(0, 8); // Top 8 skills

    setSkills(calculatedSkills);

    // --- Weekly activity chart ---
    const activityLog = JSON.parse(localStorage.getItem('activityLog') || '{}');
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
    
    const weeklyData = days.map((day, i) => {
      const targetDayOffset = (i + 1) - (dayOfWeek === 0 ? 7 : dayOfWeek); // Mon=1
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + targetDayOffset);
      const dateKey = targetDate.toISOString().split('T')[0];
      return { day, value: activityLog[dateKey] || 0 };
    });
    setWeeklyActivity(weeklyData);

    // --- Achievements ---
    const achievementStats = {
      totalProjects,
      completedTasks,
      completedWeeks,
      streak,
      joinedCommunity: communityVisited,
      completedProjects,
      resourcesUsed,
    };

    // Import achievement conditions inline
    const achievementConditions = {
      'first_project': achievementStats.totalProjects >= 1,
      'week_complete': achievementStats.completedWeeks >= 1,
      'three_projects': achievementStats.totalProjects >= 3,
      'streak_7': achievementStats.streak >= 7,
      'ten_tasks': achievementStats.completedTasks >= 10,
      'community_join': achievementStats.joinedCommunity,
      'first_complete': achievementStats.completedProjects >= 1,
      'code_master': achievementStats.completedTasks >= 50,
      'scholar': achievementStats.resourcesUsed >= 20,
    };

    const unlocked = Object.entries(achievementConditions)
      .filter(([_, met]) => met)
      .map(([id]) => id);

    setUnlockedAchievementIds(unlocked);

    // Update stats
    setStats({
      totalProjects,
      activeProjects,
      completedProjects,
      completedTasks,
      totalTasks,
      completedWeeks,
      currentWeek,
      streak,
      xp,
      level,
      xpForNextLevel: XP_PER_LEVEL,
      xpProgress,
      joinedCommunity: communityVisited,
      resourcesUsed,
    });
  }, []);

  useEffect(() => {
    calculateStats();

    // Listen for storage changes (from other components)
    const handleStorage = () => calculateStats();
    window.addEventListener('storage', handleStorage);
    
    // Custom event for same-tab updates
    window.addEventListener('statsUpdated', handleStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('statsUpdated', handleStorage);
    };
  }, [calculateStats]);

  return { stats, skills, weeklyActivity, unlockedAchievementIds, recalculate: calculateStats };
};

/**
 * Calculate day streak from activity log
 */
function calculateStreak() {
  const activityLog = JSON.parse(localStorage.getItem('activityLog') || '{}');
  const today = new Date();
  let streak = 0;

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateKey = checkDate.toISOString().split('T')[0];
    
    if (activityLog[dateKey] && activityLog[dateKey] > 0) {
      streak++;
    } else if (i === 0) {
      // Today might not have activity yet, skip
      continue;
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Record activity for today (call when user completes a task)
 */
export function recordActivity(count = 1) {
  const activityLog = JSON.parse(localStorage.getItem('activityLog') || '{}');
  const today = new Date().toISOString().split('T')[0];
  activityLog[today] = (activityLog[today] || 0) + count;
  localStorage.setItem('activityLog', JSON.stringify(activityLog));
  
  // Dispatch event to update stats in other components
  window.dispatchEvent(new Event('statsUpdated'));
}

/**
 * Record resource click (for achievement tracking)
 */
export function recordResourceClick(url) {
  const clicks = JSON.parse(localStorage.getItem('resourceClicks') || '[]');
  if (!clicks.includes(url)) {
    clicks.push(url);
    localStorage.setItem('resourceClicks', JSON.stringify(clicks));
    window.dispatchEvent(new Event('statsUpdated'));
  }
}
