import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { useRealStats } from '../hooks/useRealStats';
import { useRoadmapData } from '../hooks/useRoadmapData';
import { computeSkillCategories, rankColors } from '../hooks/useSkillsData';
import { Code2, Database, Brain, Cloud, Users, BarChart3, ArrowUpRight, Sparkles } from 'lucide-react';

const iconMap = {
  1: Code2,
  2: Database,
  3: BarChart3,
  4: Brain,
  5: Cloud,
  6: Users,
};

const SkillsMap = () => {
  const { skills: realSkills } = useRealStats();
  const { steps } = useRoadmapData();
  const [selectedArea, setSelectedArea] = useState(null);

  // Use the SAME computation as Dashboard
  const skillAreas = computeSkillCategories(realSkills, steps);

  const totalSkillScore = Math.round(
    skillAreas.reduce((sum, a) => sum + a.avgLevel, 0) / skillAreas.length
  );

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Skills Map</h1>
        <p className="text-deep-blue-400 text-sm">Track your progress across all skill areas · Updated from your projects & tasks</p>
      </motion.div>

      {/* Overall Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card-glass p-5 mb-6 flex items-center justify-between"
      >
        <div>
          <p className="text-sm text-deep-blue-400 mb-1">Overall Skill Score</p>
          <p className="text-3xl font-bold gradient-text">{totalSkillScore}%</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-deep-blue-400">
          <Sparkles className="w-4 h-4 text-neon-purple-400" />
          {skillAreas.filter(a => a.avgLevel >= 50).length} of {skillAreas.length} areas at Intermediate+
        </div>
      </motion.div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {skillAreas.map((area, i) => {
          const Icon = iconMap[area.id] || Code2;

          return (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelectedArea(selectedArea === area.id ? null : area.id)}
              className="card-glass p-5 cursor-pointer hover:border-neon-purple-500/40 transition-all group"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{area.name}</h3>
                    <p className="text-xs text-deep-blue-500">Avg: {area.avgLevel}%</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-deep-blue-600 group-hover:text-neon-purple-400 transition-colors" />
              </div>

              {/* Overall bar */}
              <div className="w-full h-2 rounded-full bg-deep-blue-800 mb-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${area.avgLevel}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                  className={`h-full rounded-full bg-gradient-to-r ${area.color}`}
                />
              </div>

              {/* Individual Skills */}
              <div className="space-y-3">
                {area.skills.map(skill => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-deep-blue-200">{skill.name}</span>
                      <span className={`text-[10px] font-medium ${rankColors[skill.rank]}`}>{skill.rank}</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-deep-blue-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                        className="h-full rounded-full bg-deep-blue-400"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Hint */}
              {selectedArea === area.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 pt-3 border-t border-deep-blue-800"
                >
                  <p className="text-xs text-deep-blue-400 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-neon-purple-400" /> To reach next level:
                  </p>
                  <p className="text-xs text-deep-blue-200 leading-relaxed">{area.nextHint}</p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default SkillsMap;
