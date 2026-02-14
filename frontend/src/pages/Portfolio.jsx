import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import {
  Github, ExternalLink, Star, GitFork, Code2,
  Award, Sparkles, ArrowUpRight, Calendar
} from 'lucide-react';

const demoProjects = [
  {
    id: 1, name: 'fastapi-todo-api', description: 'Full-stack TODO API with JWT authentication, PostgreSQL database, and comprehensive test suite. Includes Swagger docs and Docker support.',
    tech: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'], stars: 12, forks: 3, language: 'Python',
    status: 'Active', lastUpdated: '2 days ago', recommended: true, url: '#',
    highlights: ['100% test coverage', 'Docker-compose setup', 'CI/CD pipeline'],
  },
  {
    id: 2, name: 'ml-sentiment-analyzer', description: 'Real-time sentiment analysis API using scikit-learn. Trained on 50k movie reviews with 87% accuracy.',
    tech: ['Python', 'scikit-learn', 'FastAPI', 'Pandas'], stars: 8, forks: 1, language: 'Python',
    status: 'Active', lastUpdated: '1 week ago', recommended: true, url: '#',
    highlights: ['87% accuracy', 'REST API endpoint', 'Pre-trained model included'],
  },
  {
    id: 3, name: 'sanapath-ai', description: 'AI-powered career coaching platform with GitHub/LinkedIn profile analysis and personalized learning roadmaps.',
    tech: ['React', 'Tailwind CSS', 'FastAPI', 'Gemini AI'], stars: 5, forks: 0, language: 'JavaScript',
    status: 'Active', lastUpdated: '3 days ago', recommended: false, url: '#',
    highlights: ['Real AI integration', 'Firebase auth', 'Full-stack project'],
  },
  {
    id: 4, name: 'python-design-patterns', description: 'Collection of common design patterns implemented in Python with clear documentation and examples.',
    tech: ['Python', 'OOP'], stars: 3, forks: 2, language: 'Python',
    status: 'Archived', lastUpdated: '1 month ago', recommended: false, url: '#',
    highlights: ['15 patterns', 'Well-documented', 'Unit tests included'],
  },
  {
    id: 5, name: 'cli-task-manager', description: 'Command-line task management tool built with Click. Supports categories, priorities, and file persistence.',
    tech: ['Python', 'Click', 'JSON'], stars: 2, forks: 0, language: 'Python',
    status: 'Complete', lastUpdated: '2 months ago', recommended: false, url: '#',
    highlights: ['Clean CLI interface', 'Data persistence', 'Good first project'],
  },
];

const langColors = { 'Python': 'bg-blue-400', 'JavaScript': 'bg-yellow-400', 'TypeScript': 'bg-blue-500' };

const Portfolio = () => {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Recommended', 'Active', 'Complete'];
  const filtered = demoProjects.filter(p => {
    if (filter === 'Recommended') return p.recommended;
    if (filter === 'Active') return p.status === 'Active';
    if (filter === 'Complete') return p.status === 'Complete' || p.status === 'Archived';
    return true;
  });

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Portfolio</h1>
        <p className="text-deep-blue-400 text-sm">Showcase your best GitHub projects</p>
      </motion.div>

      {/* Stats bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card-glass p-4 mb-6 flex items-center gap-8"
      >
        <div className="flex items-center gap-3">
          <Github className="w-5 h-5 text-white" />
          <div>
            <p className="text-xs text-deep-blue-400">Repos</p>
            <p className="text-lg font-bold text-white">{demoProjects.length}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-deep-blue-400">Total Stars</p>
          <p className="text-lg font-bold text-white flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> {demoProjects.reduce((s, p) => s + p.stars, 0)}</p>
        </div>
        <div>
          <p className="text-xs text-deep-blue-400">Total Forks</p>
          <p className="text-lg font-bold text-white flex items-center gap-1"><GitFork className="w-4 h-4 text-deep-blue-400" /> {demoProjects.reduce((s, p) => s + p.forks, 0)}</p>
        </div>
        <div className="ml-auto">
          <p className="text-xs text-deep-blue-400">CV-Ready Projects</p>
          <p className="text-lg font-bold text-neon-purple-400">{demoProjects.filter(p => p.recommended).length}</p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? 'bg-neon-purple-500/20 text-neon-purple-400 border border-neon-purple-500/30'
                : 'text-deep-blue-400 hover:text-white hover:bg-deep-blue-800/50 border border-transparent'
            }`}
          >{f}</button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-glass p-5 hover:border-neon-purple-500/40 transition-all group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-neon-purple-400" />
                <h3 className="font-semibold text-white group-hover:text-neon-purple-400 transition-colors">{project.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                {project.recommended && (
                  <span className="px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 text-[10px] font-medium flex items-center gap-1 border border-yellow-500/20">
                    <Award className="w-3 h-3" /> CV-Ready
                  </span>
                )}
                <a href={project.url} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-deep-blue-700 text-deep-blue-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-deep-blue-300 leading-relaxed mb-3">{project.description}</p>

            {/* Highlights */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.highlights.map(h => (
                <span key={h} className="px-2 py-0.5 rounded-full bg-deep-blue-800/80 text-[11px] text-deep-blue-300 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-neon-purple-400" /> {h}
                </span>
              ))}
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tech.map(t => (
                <span key={t} className="px-2.5 py-1 rounded-lg bg-deep-blue-900/50 text-xs text-cyber-blue border border-cyber-blue/15">
                  {t}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-deep-blue-500 pt-3 border-t border-deep-blue-800">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${langColors[project.language] || 'bg-gray-400'}`} />
                  {project.language}
                </span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {project.stars}</span>
                <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {project.forks}</span>
              </div>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {project.lastUpdated}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Portfolio;
