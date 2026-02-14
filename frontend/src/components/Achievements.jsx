import { motion } from 'framer-motion';
import {
  Trophy,
  Star,
  Zap,
  Target,
  Flame,
  Award,
  Crown,
  Rocket,
  Code2,
  BookOpen,
  Users,
  CheckCircle2,
  Lock
} from 'lucide-react';

const achievementsList = [
  {
    id: 'first_project',
    icon: Rocket,
    title: 'First Launch',
    description: 'Start your first AI project',
    points: 100,
    color: 'from-green-500 to-emerald-500',
    unlockCondition: (stats) => stats.totalProjects >= 1
  },
  {
    id: 'week_complete',
    icon: Target,
    title: 'Week Warrior',
    description: 'Complete your first week',
    points: 200,
    color: 'from-blue-500 to-cyan-500',
    unlockCondition: (stats) => stats.completedWeeks >= 1
  },
  {
    id: 'three_projects',
    icon: Trophy,
    title: 'Project Pro',
    description: 'Start 3 different projects',
    points: 300,
    color: 'from-yellow-500 to-orange-500',
    unlockCondition: (stats) => stats.totalProjects >= 3
  },
  {
    id: 'streak_7',
    icon: Flame,
    title: 'On Fire!',
    description: 'Maintain a 7-day streak',
    points: 500,
    color: 'from-orange-500 to-red-500',
    unlockCondition: (stats) => stats.streak >= 7
  },
  {
    id: 'ten_tasks',
    icon: CheckCircle2,
    title: 'Task Master',
    description: 'Complete 10 tasks',
    points: 250,
    color: 'from-purple-500 to-pink-500',
    unlockCondition: (stats) => stats.completedTasks >= 10
  },
  {
    id: 'community_join',
    icon: Users,
    title: 'Team Player',
    description: 'Join a community project',
    points: 150,
    color: 'from-indigo-500 to-blue-500',
    unlockCondition: (stats) => stats.joinedCommunity
  },
  {
    id: 'first_complete',
    icon: Crown,
    title: 'Finisher',
    description: 'Complete your first project',
    points: 1000,
    color: 'from-amber-500 to-yellow-500',
    unlockCondition: (stats) => stats.completedProjects >= 1
  },
  {
    id: 'code_master',
    icon: Code2,
    title: 'Code Master',
    description: 'Complete 50 tasks total',
    points: 750,
    color: 'from-cyan-500 to-teal-500',
    unlockCondition: (stats) => stats.completedTasks >= 50
  },
  {
    id: 'scholar',
    icon: BookOpen,
    title: 'AI Scholar',
    description: 'Use 20+ learning resources',
    points: 400,
    color: 'from-pink-500 to-rose-500',
    unlockCondition: (stats) => stats.resourcesUsed >= 20
  },
  {
    id: 'streak_30',
    icon: Flame,
    title: 'Unstoppable',
    description: 'Maintain a 30-day streak',
    points: 1500,
    color: 'from-red-500 to-orange-600',
    unlockCondition: (stats) => stats.streak >= 30
  },
  {
    id: 'five_projects',
    icon: Rocket,
    title: 'Portfolio Builder',
    description: 'Start 5 different projects',
    points: 500,
    color: 'from-violet-500 to-fuchsia-500',
    unlockCondition: (stats) => stats.totalProjects >= 5
  },
  {
    id: 'roadmap_half',
    icon: Target,
    title: 'Halfway Hero',
    description: 'Complete 50% of your roadmap',
    points: 600,
    color: 'from-teal-500 to-emerald-500',
    unlockCondition: (stats) => stats.roadmapProgress >= 50
  },
  {
    id: 'roadmap_complete',
    icon: Crown,
    title: 'Roadmap Master',
    description: 'Complete your entire roadmap',
    points: 2000,
    color: 'from-amber-400 to-yellow-500',
    unlockCondition: (stats) => stats.roadmapProgress >= 100
  },
];

const AchievementCard = ({ achievement, isUnlocked, progress }) => {
  const Icon = achievement.icon;
  
  return (
    <motion.div
      className={`relative p-4 rounded-xl border transition-all ${
        isUnlocked 
          ? 'bg-deep-blue-800/50 border-neon-purple-500/30 shadow-lg shadow-neon-purple-500/10' 
          : 'bg-deep-blue-900/30 border-deep-blue-700/30 opacity-60'
      }`}
      whileHover={{ scale: isUnlocked ? 1.02 : 1, y: isUnlocked ? -2 : 0 }}
    >
      {/* Glow effect for unlocked */}
      {isUnlocked && (
        <div className="absolute inset-0 bg-gradient-to-r opacity-10 rounded-xl" 
             style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
      )}
      
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isUnlocked 
            ? `bg-gradient-to-br ${achievement.color}` 
            : 'bg-deep-blue-700/50'
        }`}>
          {isUnlocked ? (
            <Icon className="w-6 h-6 text-white" />
          ) : (
            <Lock className="w-5 h-5 text-deep-blue-500" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-deep-blue-400'}`}>
              {achievement.title}
            </h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isUnlocked 
                ? 'bg-neon-purple-500/20 text-neon-purple-400' 
                : 'bg-deep-blue-700/50 text-deep-blue-500'
            }`}>
              +{achievement.points} XP
            </span>
          </div>
          <p className={`text-sm mt-1 ${isUnlocked ? 'text-deep-blue-300' : 'text-deep-blue-500'}`}>
            {achievement.description}
          </p>
          
          {/* Progress bar for locked achievements */}
          {!isUnlocked && progress !== undefined && (
            <div className="mt-2">
              <div className="h-1.5 bg-deep-blue-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-deep-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-deep-blue-500 mt-1">{Math.round(progress)}% complete</p>
            </div>
          )}
        </div>
      </div>
      
      {isUnlocked && (
        <motion.div
          className="absolute top-2 right-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </motion.div>
      )}
    </motion.div>
  );
};

const Achievements = ({ stats = {} }) => {
  const defaultStats = {
    totalProjects: 0,
    completedProjects: 0,
    completedTasks: 0,
    completedWeeks: 0,
    streak: 0,
    joinedCommunity: false,
    resourcesUsed: 0,
    roadmapProgress: 0,
    ...stats
  };

  const unlockedAchievements = achievementsList.filter(a => a.unlockCondition(defaultStats));
  const totalPoints = unlockedAchievements.reduce((acc, a) => acc + a.points, 0);
  const level = Math.floor(totalPoints / 500) + 1;
  const progressToNextLevel = (totalPoints % 500) / 5;

  const getProgress = (achievement) => {
    switch (achievement.id) {
      case 'first_project':
      case 'three_projects':
        return (defaultStats.totalProjects / (achievement.id === 'first_project' ? 1 : 3)) * 100;
      case 'five_projects':
        return (defaultStats.totalProjects / 5) * 100;
      case 'ten_tasks':
        return (defaultStats.completedTasks / 10) * 100;
      case 'code_master':
        return (defaultStats.completedTasks / 50) * 100;
      case 'streak_7':
        return (defaultStats.streak / 7) * 100;
      case 'streak_30':
        return (defaultStats.streak / 30) * 100;
      case 'roadmap_half':
        return ((defaultStats.roadmapProgress || 0) / 50) * 100;
      case 'roadmap_complete':
        return (defaultStats.roadmapProgress || 0);
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Level & XP Header */}
      <div className="card-glass p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Level {level}</h3>
              <p className="text-deep-blue-400">
                {totalPoints} XP • {unlockedAchievements.length}/{achievementsList.length} Achievements
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-deep-blue-400">Next level</p>
            <p className="text-lg font-bold text-neon-purple-400">{500 - (totalPoints % 500)} XP</p>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="h-3 bg-deep-blue-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressToNextLevel}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Achievements
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievementsList.map((achievement) => {
            const isUnlocked = achievement.unlockCondition(defaultStats);
            return (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={isUnlocked}
                progress={!isUnlocked ? getProgress(achievement) : undefined}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievements;

// Named exports for use in other components
export { achievementsList as achievements, AchievementCard };
