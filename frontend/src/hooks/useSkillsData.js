/**
 * Shared skill computation used by BOTH Dashboard and SkillsMap.
 * Single source of truth for how skills are displayed.
 */

// Skill category definitions — the canonical structure
export const SKILL_CATEGORIES = [
  {
    id: 1, name: 'Backend Development', color: 'from-violet-500 to-purple-600',
    techs: ['Python', 'FastAPI', 'REST APIs', 'Flask', 'Node.js', 'Authentication', 'JWT Auth'],
    subSkills: ['Python', 'FastAPI', 'REST APIs', 'Authentication'],
    barColor: '#8B5CF6', barColorEnd: '#7C3AED',
    nextHint: 'Build a CRUD API with auth to level up FastAPI',
  },
  {
    id: 2, name: 'Databases', color: 'from-cyan-500 to-blue-600',
    techs: ['PostgreSQL', 'MongoDB', 'SQLAlchemy', 'SQL', 'Data Modeling'],
    subSkills: ['SQL', 'PostgreSQL', 'SQLAlchemy', 'Data Modeling'],
    barColor: '#06B6D4', barColorEnd: '#2563EB',
    nextHint: 'Practice complex queries and relationships in PostgreSQL',
  },
  {
    id: 3, name: 'Algorithms & DS', color: 'from-emerald-500 to-green-600',
    techs: [],
    subSkills: ['Arrays & Strings', 'Sorting & Search', 'Trees & Graphs', 'Dynamic Programming'],
    barColor: '#10B981', barColorEnd: '#059669',
    nextHint: 'Solve 5 medium LeetCode problems on trees to level up',
  },
  {
    id: 4, name: 'Machine Learning', color: 'from-pink-500 to-rose-600',
    techs: ['Pandas', 'scikit-learn', 'PyTorch', 'TensorFlow', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'YOLO', 'Hugging Face', 'OpenAI API', 'NumPy', 'Scikit-learn', 'OpenCV'],
    subSkills: ['pandas', 'scikit-learn', 'Data Analysis', 'Model Evaluation'],
    barColor: '#EC4899', barColorEnd: '#DB2777',
    nextHint: 'Complete an EDA project on Kaggle to practice pandas',
  },
  {
    id: 5, name: 'DevOps & Cloud', color: 'from-amber-500 to-orange-600',
    techs: ['Docker', 'GitHub Actions', 'CI/CD', 'Docker basics'],
    subSkills: ['Docker', 'CI/CD', 'Linux/CLI', 'Cloud Deploy'],
    barColor: '#F59E0B', barColorEnd: '#D97706',
    nextHint: 'Dockerize your FastAPI project to get started with DevOps',
  },
  {
    id: 6, name: 'Soft Skills', color: 'from-indigo-500 to-violet-600',
    techs: [],
    subSkills: ['Communication', 'Teamwork', 'Technical Writing', 'Interview Skills'],
    barColor: '#6366F1', barColorEnd: '#4F46E5',
    nextHint: 'Write a technical blog post about your latest project',
  },
];

function getRank(level) {
  if (level >= 80) return 'Advanced';
  if (level >= 50) return 'Intermediate';
  if (level >= 25) return 'Beginner+';
  return 'Beginner';
}

export const rankColors = {
  'Beginner': 'text-deep-blue-400',
  'Beginner+': 'text-cyan-400',
  'Intermediate': 'text-neon-purple-400',
  'Advanced': 'text-green-400',
};

/**
 * Compute skill levels for all categories from two data sources:
 *  1. realSkills — per-tech skills from useRealStats (project-based)
 *  2. roadmapSteps — step tasks with completion status
 *
 * Returns array of categories with computed sub-skill levels + category average.
 * Used by BOTH Dashboard and SkillsMap for identical data.
 */
export function computeSkillCategories(realSkills = [], roadmapSteps = []) {
  // Build lookup: tech name → level from real project data
  const realMap = {};
  realSkills.forEach(s => { realMap[s.name] = s.level; });

  // Compute boost from roadmap step task completion
  const stepBoosts = {};
  roadmapSteps.forEach(step => {
    const tasks = step.tasks || [];
    if (tasks.length === 0) return;
    const done = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const ratio = (done + inProgress * 0.3) / tasks.length;
    // Map step skills → boost
    (step.skills || []).forEach(sk => {
      stepBoosts[sk] = Math.max(stepBoosts[sk] || 0, Math.round(ratio * 50 + (done > 0 ? 10 : 0)));
    });
  });

  return SKILL_CATEGORIES.map(cat => {
    // Find the max real skill level among ALL techs linked to this category
    let categoryTechBoost = 0;
    cat.techs.forEach(tech => {
      if (realMap[tech]) {
        categoryTechBoost = Math.max(categoryTechBoost, realMap[tech]);
      }
    });

    const updatedSkills = cat.subSkills.map(skillName => {
      let level = 0;

      // 1. Direct match from real project data
      if (realMap[skillName]) {
        level = realMap[skillName];
      }
      // 2. Roadmap step boost (exact skill name match)
      if (stepBoosts[skillName]) {
        level = Math.max(level, stepBoosts[skillName]);
      }
      // 3. Category tech boost — if ANY tech in category has real data,
      //    propagate a proportional boost to all sub-skills in the category.
      //    This fixes the "Python 80% but REST APIs 0%" problem.
      if (level === 0 && categoryTechBoost > 0) {
        level = Math.round(categoryTechBoost * 0.5); // 50% spillover
      }

      // Also check fuzzy matches in step skills
      Object.entries(stepBoosts).forEach(([key, boost]) => {
        if (key.toLowerCase().includes(skillName.toLowerCase()) ||
            skillName.toLowerCase().includes(key.toLowerCase())) {
          level = Math.max(level, boost);
        }
      });

      level = Math.min(level, 100);
      return { name: skillName, level, rank: getRank(level) };
    });

    const avgLevel = Math.round(
      updatedSkills.reduce((sum, sk) => sum + sk.level, 0) / updatedSkills.length
    );

    return {
      ...cat,
      skills: updatedSkills,
      avgLevel,
      avgRank: getRank(avgLevel),
    };
  });
}

/**
 * Get flat list of top skills for Dashboard "Your Skills" widget.
 * Takes category data and flattens to top N skills sorted by level.
 */
export function getTopSkillsFlat(categories, maxCount = 6) {
  return categories
    .map(cat => ({
      name: cat.name,
      level: cat.avgLevel,
      color: cat.barColor,
      colorEnd: cat.barColorEnd,
    }))
    .sort((a, b) => b.level - a.level)
    .slice(0, maxCount);
}
