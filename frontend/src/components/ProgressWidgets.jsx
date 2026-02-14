import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';

// Animated Counter component
export const AnimatedCounter = ({ value, duration = 2, className = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const numericValue = parseInt(value.toString().replace(/[^0-9]/g, ''));
    const suffix = value.toString().replace(/[0-9]/g, '');
    
    let startTime;
    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(easeOutQuart * numericValue));
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [value, duration, isVisible]);

  const suffix = value.toString().replace(/[0-9]/g, '');

  return (
    <span ref={countRef} className={className}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

// Progress Ring component
export const ProgressRing = memo(({ progress, size = 120, strokeWidth = 8, children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-deep-blue-800"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
});

// Weekly Progress Chart
export const WeeklyProgressChart = memo(({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="h-40 flex items-end justify-between gap-2">
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 100;
        const isToday = index === new Date().getDay() - 1;
        
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              className={`w-full rounded-t-lg ${
                isToday 
                  ? 'bg-gradient-to-t from-neon-purple-500 to-cyber-blue' 
                  : 'bg-deep-blue-700'
              }`}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(height, 5)}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
            <span className={`text-xs ${isToday ? 'text-white font-medium' : 'text-deep-blue-500'}`}>
              {days[index]}
            </span>
          </div>
        );
      })}
    </div>
  );
});

// Streak Counter
export const StreakCounter = ({ streak, maxStreak = 30 }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"
          animate={{ 
            boxShadow: streak > 0 ? [
              '0 0 20px rgba(249, 115, 22, 0.3)',
              '0 0 40px rgba(249, 115, 22, 0.5)',
              '0 0 20px rgba(249, 115, 22, 0.3)'
            ] : 'none'
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-2xl font-bold text-white">{streak}</span>
        </motion.div>
        
        {/* Flame icon for active streak */}
        {streak > 0 && (
          <motion.div
            className="absolute -top-2 -right-2 text-2xl"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            🔥
          </motion.div>
        )}
      </div>
      <p className="text-deep-blue-400 mt-2 text-sm">Day Streak</p>
      
      {/* Streak progress */}
      <div className="w-full mt-3">
        <div className="flex justify-between text-xs text-deep-blue-500 mb-1">
          <span>0</span>
          <span>{maxStreak} days</span>
        </div>
        <div className="h-2 bg-deep-blue-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(streak / maxStreak) * 100}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>
    </div>
  );
};

// Skill Radar Chart (simplified version)
export const SkillBars = memo(({ skills }) => {
  return (
    <div className="space-y-3">
      {skills.map((skill, index) => (
        <div key={skill.name}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-deep-blue-300">{skill.name}</span>
            <span className="text-deep-blue-500">{skill.level}%</span>
          </div>
          <div className="h-2 bg-deep-blue-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ 
                background: `linear-gradient(to right, ${skill.color || '#8B5CF6'}, ${skill.colorEnd || '#06B6D4'})` 
              }}
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
});

// Activity Heatmap
export const ActivityHeatmap = ({ data, weeks = 12 }) => {
  const days = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];
  
  const getColor = (value) => {
    if (value === 0) return 'bg-deep-blue-800';
    if (value <= 2) return 'bg-neon-purple-900';
    if (value <= 4) return 'bg-neon-purple-700';
    if (value <= 6) return 'bg-neon-purple-500';
    return 'bg-neon-purple-400';
  };

  return (
    <div className="flex gap-1">
      {/* Day labels */}
      <div className="flex flex-col gap-1 mr-2">
        {days.map((day, i) => (
          <div key={i} className="h-3 text-xs text-deep-blue-500 flex items-center">
            {day}
          </div>
        ))}
      </div>
      
      {/* Heatmap grid */}
      <div className="flex gap-1">
        {Array.from({ length: weeks }).map((_, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              const dataIndex = weekIndex * 7 + dayIndex;
              const value = data[dataIndex] || 0;
              
              return (
                <motion.div
                  key={dayIndex}
                  className={`w-3 h-3 rounded-sm ${getColor(value)}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: (weekIndex * 7 + dayIndex) * 0.005 }}
                  title={`${value} activities`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default {
  AnimatedCounter,
  ProgressRing,
  WeeklyProgressChart,
  StreakCounter,
  SkillBars,
  ActivityHeatmap
};
