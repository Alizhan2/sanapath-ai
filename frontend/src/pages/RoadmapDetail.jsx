import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import {
  ChevronRight, BookOpen, Code2, Rocket, Award,
  Clock, Flame, Target, Zap
} from 'lucide-react';

const roadmapSteps = [
  {
    id: 1, step: 1,
    title: 'Foundations: Python & Git',
    goal: 'Master Python core + Git workflow to confidently contribute to team projects and open source.',
    skills: ['Python 3.x', 'Git & GitHub', 'CLI basics', 'Virtual environments'],
    projects: [
      { name: 'CLI Task Manager', desc: 'Build a command-line todo app with file persistence' },
      { name: 'GitHub Portfolio Setup', desc: 'Create a professional profile with pinned repos' },
    ],
    status: 'completed', progress: 100, duration: '3-4 weeks',
  },
  {
    id: 2, step: 2,
    title: 'Backend Development with FastAPI',
    goal: 'Build production-quality REST APIs. Understand databases, auth, testing, and deployment.',
    skills: ['FastAPI', 'SQLAlchemy', 'PostgreSQL', 'JWT Auth', 'Pytest', 'Docker basics'],
    projects: [
      { name: 'CRUD API + PostgreSQL', desc: 'Full REST API with user auth and database' },
      { name: 'API Testing Suite', desc: 'Write comprehensive tests for all endpoints' },
      { name: 'README Excellence', desc: 'Create portfolio-worthy documentation' },
    ],
    status: 'in-progress', progress: 45, duration: '5-6 weeks',
  },
  {
    id: 3, step: 3,
    title: 'DevOps & Deployment',
    goal: 'Deploy your apps professionally. Learn CI/CD, Docker, and cloud basics.',
    skills: ['Docker', 'CI/CD', 'Render/Railway', 'GitHub Actions', 'Environment management'],
    projects: [
      { name: 'Containerize Your API', desc: 'Dockerize FastAPI app with docker-compose' },
      { name: 'Auto-Deploy Pipeline', desc: 'Set up GitHub Actions for automated testing & deployment' },
    ],
    status: 'upcoming', progress: 0, duration: '3-4 weeks',
  },
  {
    id: 4, step: 4,
    title: 'ML & AI Integration',
    goal: 'Integrate machine learning into your backend. Build intelligent features.',
    skills: ['scikit-learn', 'Pandas', 'ML APIs', 'Model serving', 'Data pipelines'],
    projects: [
      { name: 'Recommendation Engine', desc: 'Build a simple content recommendation API' },
      { name: 'AI-Powered Feature', desc: 'Add smart features to your existing project' },
    ],
    status: 'locked', progress: 0, duration: '4-5 weeks',
  },
  {
    id: 5, step: 5,
    title: 'Portfolio & Job Readiness',
    goal: 'Polish everything. Build a standout portfolio, optimize LinkedIn, and start applying.',
    skills: ['Portfolio design', 'LinkedIn optimization', 'Interview prep', 'System design basics'],
    projects: [
      { name: 'Portfolio Website', desc: 'Showcase your best projects with live demos' },
      { name: 'Open Source Contribution', desc: 'Make a meaningful PR to a popular project' },
    ],
    status: 'locked', progress: 0, duration: '3-4 weeks',
  },
];

const statusConfig = {
  'completed': { color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/30', icon: Award, label: 'Completed' },
  'in-progress': { color: 'text-neon-purple-400', bg: 'bg-neon-purple-500/15 border-neon-purple-500/30', icon: Flame, label: 'In Progress' },
  'upcoming': { color: 'text-cyber-blue', bg: 'bg-cyber-blue/15 border-cyber-blue/30', icon: Target, label: 'Up Next' },
  'locked': { color: 'text-deep-blue-500', bg: 'bg-deep-blue-800/50 border-deep-blue-700', icon: Clock, label: 'Locked' },
};

const RoadmapDetail = () => {
  const [expandedStep, setExpandedStep] = useState(2);
  const totalProgress = Math.round(roadmapSteps.reduce((sum, s) => sum + s.progress, 0) / roadmapSteps.length);

  return (
    <DashboardLayout>
      <div className="flex gap-6 min-h-[calc(100vh-5rem)]">
        {/* Timeline */}
        <div className="flex-1">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Your Roadmap</h1>
            <p className="text-deep-blue-400 text-sm">Backend Developer → ML Engineer · Personalized for your goals</p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-deep-blue-800" />

            <div className="space-y-4">
              {roadmapSteps.map((step, i) => {
                const cfg = statusConfig[step.status];
                const Icon = cfg.icon;
                const isExpanded = expandedStep === step.id;
                const isActive = step.status === 'in-progress';

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                  >
                    {/* Step indicator on timeline */}
                    <div className={`absolute left-3.5 w-5 h-5 rounded-full flex items-center justify-center z-10 ${
                      isActive ? 'bg-neon-purple-500 shadow-lg shadow-neon-purple-500/30' :
                      step.status === 'completed' ? 'bg-green-500' : 'bg-deep-blue-700'
                    }`}>
                      <span className="text-[10px] font-bold text-white">{step.step}</span>
                    </div>

                    {/* Card */}
                    <div
                      className={`ml-14 card-glass p-5 cursor-pointer transition-all ${
                        isActive ? 'border-neon-purple-500/40 shadow-lg shadow-neon-purple-500/5' :
                        step.status === 'completed' ? 'border-green-500/20' :
                        'hover:border-deep-blue-600'
                      }`}
                      onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
                              <Icon className="w-3 h-3 inline mr-1" />
                              {cfg.label}
                            </span>
                            <span className="text-xs text-deep-blue-500">{step.duration}</span>
                          </div>
                          <h3 className={`text-lg font-semibold ${step.status === 'locked' ? 'text-deep-blue-500' : 'text-white'}`}>
                            {step.title}
                          </h3>
                        </div>
                        {step.progress > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-deep-blue-800 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${step.progress}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className={`h-full rounded-full ${step.status === 'completed' ? 'bg-green-400' : 'bg-neon-purple-400'}`}
                              />
                            </div>
                            <span className="text-xs text-deep-blue-400">{step.progress}%</span>
                          </div>
                        )}
                        <ChevronRight className={`w-5 h-5 text-deep-blue-500 ml-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-4 pt-4 border-t border-deep-blue-800 space-y-4"
                        >
                          <p className="text-sm text-deep-blue-300 leading-relaxed">{step.goal}</p>

                          {/* Skills */}
                          <div>
                            <h4 className="text-xs font-medium text-deep-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                              <Zap className="w-3 h-3" /> Skills to learn
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {step.skills.map(sk => (
                                <span key={sk} className="px-2.5 py-1 rounded-lg bg-deep-blue-800/50 text-xs text-deep-blue-200 border border-deep-blue-700">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Mini-projects */}
                          <div>
                            <h4 className="text-xs font-medium text-deep-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                              <Code2 className="w-3 h-3" /> Suggested Projects
                            </h4>
                            <div className="space-y-2">
                              {step.projects.map((p, j) => (
                                <div key={j} className="flex items-start gap-3 p-3 rounded-xl bg-deep-blue-900/30 border border-deep-blue-800/50">
                                  <Rocket className="w-4 h-4 text-neon-purple-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium text-white">{p.name}</p>
                                    <p className="text-xs text-deep-blue-400 mt-0.5">{p.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {(step.status === 'in-progress' || step.status === 'upcoming') && (
                            <button className="btn-primary w-full text-sm !py-2.5 flex items-center justify-center gap-2">
                              <BookOpen className="w-4 h-4" /> View Tasks
                            </button>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="w-72 flex-shrink-0 space-y-4">
          {/* Overall Progress */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-5 sticky top-6">
            <h3 className="text-sm font-semibold text-white mb-4">Roadmap Overview</h3>
            <div className="flex items-center justify-center mb-4">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none" stroke="url(#roadmap-grad)" strokeWidth="8"
                  strokeLinecap="round" strokeDasharray={264}
                  initial={{ strokeDashoffset: 264 }}
                  animate={{ strokeDashoffset: 264 - (264 * totalProgress / 100) }}
                  transition={{ duration: 1.5 }}
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="roadmap-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <text x="50" y="50" textAnchor="middle" dominantBaseline="central" className="text-xl font-bold fill-white">{totalProgress}%</text>
              </svg>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-deep-blue-400">Estimated Duration</span>
                <span className="text-white font-medium">18-23 weeks</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-deep-blue-400">Hours / week</span>
                <span className="text-white font-medium">10-15 hrs</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-deep-blue-400">Steps Completed</span>
                <span className="text-white font-medium">{roadmapSteps.filter(s => s.status === 'completed').length} / {roadmapSteps.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-deep-blue-400">Current Step</span>
                <span className="text-neon-purple-400 font-medium">{roadmapSteps.find(s => s.status === 'in-progress')?.title?.split(':')[0] || 'N/A'}</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Tips */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-glass p-5">
            <h3 className="text-sm font-semibold text-white mb-3">💡 AI Tip</h3>
            <p className="text-xs text-deep-blue-300 leading-relaxed">
              You're 45% through Step 2! Focus on completing the CRUD API this week. 
              Push it to GitHub to boost your profile score by ~15%.
            </p>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RoadmapDetail;
