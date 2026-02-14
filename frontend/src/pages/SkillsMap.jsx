import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { Code2, Database, Brain, Cloud, Users, BarChart3, ArrowUpRight, Sparkles } from 'lucide-react';

const skillAreas = [
  {
    id: 1, name: 'Backend Development', icon: Code2, color: 'from-violet-500 to-purple-600',
    skills: [
      { name: 'Python', level: 72, rank: 'Intermediate' },
      { name: 'FastAPI', level: 45, rank: 'Beginner+' },
      { name: 'REST APIs', level: 60, rank: 'Intermediate' },
      { name: 'Authentication', level: 30, rank: 'Beginner' },
    ],
    nextHint: 'Build a CRUD API with auth to reach Intermediate+ in FastAPI',
  },
  {
    id: 2, name: 'Databases', icon: Database, color: 'from-cyan-500 to-blue-600',
    skills: [
      { name: 'SQL', level: 55, rank: 'Intermediate' },
      { name: 'PostgreSQL', level: 35, rank: 'Beginner' },
      { name: 'SQLAlchemy', level: 25, rank: 'Beginner' },
      { name: 'Data Modeling', level: 40, rank: 'Beginner+' },
    ],
    nextHint: 'Practice complex queries and relationships in PostgreSQL',
  },
  {
    id: 3, name: 'Algorithms & DS', icon: BarChart3, color: 'from-emerald-500 to-green-600',
    skills: [
      { name: 'Arrays & Strings', level: 65, rank: 'Intermediate' },
      { name: 'Sorting & Search', level: 50, rank: 'Intermediate' },
      { name: 'Trees & Graphs', level: 20, rank: 'Beginner' },
      { name: 'Dynamic Programming', level: 10, rank: 'Beginner' },
    ],
    nextHint: 'Solve 5 medium LeetCode problems on trees to level up',
  },
  {
    id: 4, name: 'Machine Learning', icon: Brain, color: 'from-pink-500 to-rose-600',
    skills: [
      { name: 'pandas', level: 40, rank: 'Beginner+' },
      { name: 'scikit-learn', level: 15, rank: 'Beginner' },
      { name: 'Data Analysis', level: 35, rank: 'Beginner' },
      { name: 'Model Evaluation', level: 10, rank: 'Beginner' },
    ],
    nextHint: 'Complete an EDA project on Kaggle to practice pandas',
  },
  {
    id: 5, name: 'DevOps & Cloud', icon: Cloud, color: 'from-amber-500 to-orange-600',
    skills: [
      { name: 'Docker', level: 20, rank: 'Beginner' },
      { name: 'CI/CD', level: 10, rank: 'Beginner' },
      { name: 'Linux/CLI', level: 50, rank: 'Intermediate' },
      { name: 'Cloud Deploy', level: 30, rank: 'Beginner' },
    ],
    nextHint: 'Dockerize your FastAPI project to get started with DevOps',
  },
  {
    id: 6, name: 'Soft Skills', icon: Users, color: 'from-indigo-500 to-violet-600',
    skills: [
      { name: 'Communication', level: 70, rank: 'Intermediate' },
      { name: 'Teamwork', level: 65, rank: 'Intermediate' },
      { name: 'Technical Writing', level: 45, rank: 'Beginner+' },
      { name: 'Interview Skills', level: 25, rank: 'Beginner' },
    ],
    nextHint: 'Write a technical blog post about your latest project',
  },
];

const rankColors = {
  'Beginner': 'text-deep-blue-400',
  'Beginner+': 'text-cyan-400',
  'Intermediate': 'text-neon-purple-400',
  'Advanced': 'text-green-400',
};

const SkillsMap = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const totalSkillScore = Math.round(skillAreas.reduce((sum, a) => sum + a.skills.reduce((s, sk) => s + sk.level, 0), 0) / (skillAreas.length * 4));

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Skills Map</h1>
        <p className="text-deep-blue-400 text-sm">Track your progress across all skill areas</p>
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
          {skillAreas.filter(a => a.skills.some(s => s.level >= 50)).length} of {skillAreas.length} areas at Intermediate+
        </div>
      </motion.div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {skillAreas.map((area, i) => {
          const Icon = area.icon;
          const avgLevel = Math.round(area.skills.reduce((s, sk) => s + sk.level, 0) / area.skills.length);

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
                    <p className="text-xs text-deep-blue-500">Avg: {avgLevel}%</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-deep-blue-600 group-hover:text-neon-purple-400 transition-colors" />
              </div>

              {/* Overall bar */}
              <div className="w-full h-2 rounded-full bg-deep-blue-800 mb-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${avgLevel}%` }}
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
