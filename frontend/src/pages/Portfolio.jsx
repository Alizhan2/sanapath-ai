import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import {
  Github, ExternalLink, Star, GitFork, Code2,
  Award, Sparkles, ArrowUpRight, Calendar, Rocket, Plus
} from 'lucide-react';

const langColors = { 'Python': 'bg-blue-400', 'JavaScript': 'bg-yellow-400', 'TypeScript': 'bg-blue-500', 'React': 'bg-cyan-400', 'FastAPI': 'bg-emerald-400' };

const Portfolio = () => {
  const [filter, setFilter] = useState('All');

  // Load REAL user projects from localStorage
  const userProjects = useMemo(() => {
    const saved = JSON.parse(localStorage.getItem('userProjects') || '[]');
    return saved.map(p => {
      const roadmap = p.roadmap || [];
      const totalTasks = roadmap.reduce((sum, week) => sum + (week.tasks?.length || 0), 0);
      const doneTasks = Object.values(p.completedTasks || {}).filter(Boolean).length;
      const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
      const tech = p.tech_stack || p.tech || [];
      const mainLang = tech[0] || 'Python';
      const started = p.startedAt ? new Date(p.startedAt) : new Date();
      const daysSince = Math.floor((Date.now() - started.getTime()) / (1000 * 60 * 60 * 24));
      const lastUpdated = daysSince === 0 ? 'Today' : daysSince === 1 ? 'Yesterday' : `${daysSince} days ago`;

      return {
        id: p.id,
        name: p.title || 'Untitled Project',
        description: p.description || '',
        tech,
        language: mainLang,
        status: p.status === 'completed' ? 'Complete' : progress > 0 ? 'Active' : 'New',
        lastUpdated,
        progress,
        doneTasks,
        totalTasks,
        recommended: progress >= 80 || p.status === 'completed',
        highlights: [
          `${doneTasks}/${totalTasks} tasks done`,
          `${progress}% complete`,
          ...(p.learning_outcomes?.slice(0, 1) || []),
        ],
      };
    });
  }, []);

  const filters = ['All', 'Active', 'Complete', 'CV-Ready'];
  const filtered = userProjects.filter(p => {
    if (filter === 'Active') return p.status === 'Active' || p.status === 'New';
    if (filter === 'Complete') return p.status === 'Complete';
    if (filter === 'CV-Ready') return p.recommended;
    return true;
  });

  if (userProjects.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-purple-500/20 to-cyber-blue/20 flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-10 h-10 text-neon-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No Projects Yet</h2>
            <p className="text-deep-blue-400 mb-6">Take the survey to get personalized project recommendations and build your portfolio!</p>
            <Link to="/survey" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Start Your First Project
            </Link>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

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
          <Code2 className="w-5 h-5 text-neon-purple-400" />
          <div>
            <p className="text-xs text-deep-blue-400">Projects</p>
            <p className="text-lg font-bold text-white">{userProjects.length}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-deep-blue-400">Total Tasks Done</p>
          <p className="text-lg font-bold text-white flex items-center gap-1"><Sparkles className="w-4 h-4 text-neon-purple-400" /> {userProjects.reduce((s, p) => s + p.doneTasks, 0)}</p>
        </div>
        <div>
          <p className="text-xs text-deep-blue-400">Avg Progress</p>
          <p className="text-lg font-bold text-white">{Math.round(userProjects.reduce((s, p) => s + p.progress, 0) / userProjects.length)}%</p>
        </div>
        <div className="ml-auto">
          <p className="text-xs text-deep-blue-400">CV-Ready Projects</p>
          <p className="text-lg font-bold text-neon-purple-400">{userProjects.filter(p => p.recommended).length}</p>
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
                <a href={`/project/${project.id}`}
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
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  project.status === 'Complete' ? 'bg-green-500/20 text-green-400' :
                  project.status === 'Active' ? 'bg-neon-purple-500/20 text-neon-purple-400' :
                  'bg-deep-blue-700 text-deep-blue-400'
                }`}>{project.status}</span>
                <span>{project.progress}%</span>
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
