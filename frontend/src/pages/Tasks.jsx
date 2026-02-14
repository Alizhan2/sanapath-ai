import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import {
  CheckCircle2, Circle, Clock, Tag, Calendar, ChevronRight,
  X, FileText, Timer, CheckSquare, Filter, Search
} from 'lucide-react';

const demoTasks = [
  { id: 1, title: 'Build a CRUD API with FastAPI and PostgreSQL', tags: ['Backend', 'Project', 'GitHub'], due: '2026-02-20', status: 'in-progress', step: 2, description: 'Create a complete REST API using FastAPI with SQLAlchemy ORM and PostgreSQL. Include models for users and items, proper error handling, and Swagger documentation.', checklist: ['Set up FastAPI project', 'Create SQLAlchemy models', 'Implement CRUD endpoints', 'Add authentication', 'Write API documentation'], estimated: '8 hours', notes: '' },
  { id: 2, title: 'Write unit tests for your main project', tags: ['Testing', 'Backend'], due: '2026-02-22', status: 'todo', step: 2, description: 'Add comprehensive test coverage using pytest. Cover all API endpoints, model validations, and edge cases.', checklist: ['Install pytest & httpx', 'Test GET endpoints', 'Test POST/PUT/DELETE', 'Test error cases', 'Achieve 80%+ coverage'], estimated: '5 hours', notes: '' },
  { id: 3, title: 'Improve README for fastapi-todo repo', tags: ['GitHub', 'Portfolio'], due: '2026-02-18', status: 'done', step: 2, description: 'Create a professional README with project description, screenshots, installation guide, and API documentation.', checklist: ['Add project overview', 'Add installation steps', 'Include API examples', 'Add screenshots', 'Add badges'], estimated: '2 hours', notes: '' },
  { id: 4, title: 'Deploy API to Render with CI/CD', tags: ['DevOps', 'Backend'], due: '2026-02-25', status: 'todo', step: 3, description: 'Set up automatic deployment pipeline from GitHub to Render. Configure environment variables and health checks.', checklist: ['Create Render account', 'Configure deployment', 'Set environment variables', 'Add health endpoint', 'Test auto-deploy'], estimated: '3 hours', notes: '' },
  { id: 5, title: 'Learn Docker basics and containerize your app', tags: ['DevOps', 'Project'], due: '2026-02-28', status: 'todo', step: 3, description: 'Create a Dockerfile for your FastAPI app, learn docker-compose for multi-container setups with PostgreSQL.', checklist: ['Install Docker Desktop', 'Write Dockerfile', 'Create docker-compose.yml', 'Add PostgreSQL container', 'Test locally'], estimated: '6 hours', notes: '' },
  { id: 6, title: 'Optimize LinkedIn headline for backend roles', tags: ['LinkedIn', 'Career'], due: '2026-02-19', status: 'in-progress', step: 2, description: 'Update your LinkedIn headline with keywords that recruiters search for: Python, FastAPI, PostgreSQL, REST APIs.', checklist: ['Research top headlines', 'Draft 3 options', 'Get feedback', 'Update headline', 'Update summary'], estimated: '1 hour', notes: '' },
];

const filters = ['All tasks', 'This week', 'This month', 'By step'];
const statusColors = {
  'done': 'bg-green-500/20 text-green-400',
  'in-progress': 'bg-yellow-500/20 text-yellow-400',
  'todo': 'bg-deep-blue-700 text-deep-blue-300',
};
const statusLabels = { 'done': 'Done', 'in-progress': 'In Progress', 'todo': 'To Do' };

const Tasks = () => {
  const [tasks, setTasks] = useState(demoTasks);
  const [activeFilter, setActiveFilter] = useState('All tasks');
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t));
  };

  const filtered = tasks.filter(t => {
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilter === 'This week') return new Date(t.due) <= new Date(Date.now() + 7 * 86400000);
    if (activeFilter === 'This month') return new Date(t.due).getMonth() === new Date().getMonth();
    return true;
  });

  const grouped = activeFilter === 'By step'
    ? Object.entries(filtered.reduce((acc, t) => { (acc[`Step ${t.step}`] = acc[`Step ${t.step}`] || []).push(t); return acc; }, {}))
    : [['', filtered]];

  return (
    <DashboardLayout>
      <div className="flex gap-6 min-h-[calc(100vh-5rem)]">
        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Tasks</h1>
            <p className="text-deep-blue-400 text-sm">Manage your roadmap tasks and track progress</p>
          </motion.div>

          {/* Filters + Search */}
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex gap-2">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeFilter === f
                      ? 'bg-neon-purple-500/20 text-neon-purple-400 border border-neon-purple-500/30'
                      : 'text-deep-blue-400 hover:text-white hover:bg-deep-blue-800/50 border border-transparent'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-blue-500" />
              <input
                type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 rounded-xl bg-deep-blue-900/50 border border-deep-blue-700 text-white placeholder-deep-blue-500 focus:outline-none focus:border-neon-purple-500 text-sm w-60"
              />
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-6">
            {grouped.map(([group, items]) => (
              <div key={group}>
                {group && <h3 className="text-sm font-semibold text-deep-blue-400 uppercase tracking-wider mb-3">{group}</h3>}
                <div className="space-y-2">
                  {items.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedTask(task)}
                      className={`card-glass p-4 cursor-pointer hover:border-neon-purple-500/50 transition-all flex items-center gap-4 ${
                        selectedTask?.id === task.id ? 'border-neon-purple-500/50' : ''
                      }`}
                    >
                      <button onClick={e => { e.stopPropagation(); toggleTask(task.id); }}>
                        {task.status === 'done'
                          ? <CheckCircle2 className="w-5 h-5 text-green-400" />
                          : <Circle className="w-5 h-5 text-deep-blue-600 hover:text-neon-purple-400 transition-colors" />
                        }
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${task.status === 'done' ? 'text-deep-blue-500 line-through' : 'text-white'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          {task.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-deep-blue-800/80 text-xs text-deep-blue-300 flex items-center gap-1">
                              <Tag className="w-3 h-3" /> {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-deep-blue-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(task.due).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                          {statusLabels[task.status]}
                        </span>
                        <ChevronRight className="w-4 h-4 text-deep-blue-600" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Drawer — Task Detail */}
        <AnimatePresence>
          {selectedTask && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="w-96 flex-shrink-0"
            >
              <div className="card-glass p-6 sticky top-6 space-y-5">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-white pr-4">{selectedTask.title}</h3>
                  <button onClick={() => setSelectedTask(null)} className="p-1.5 rounded-lg hover:bg-deep-blue-700 text-deep-blue-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedTask.status]}`}>
                  {statusLabels[selectedTask.status]}
                </span>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-medium text-deep-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Description
                  </h4>
                  <p className="text-sm text-deep-blue-200 leading-relaxed">{selectedTask.description}</p>
                </div>

                {/* Checklist */}
                <div>
                  <h4 className="text-xs font-medium text-deep-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <CheckSquare className="w-3 h-3" /> Checklist
                  </h4>
                  <div className="space-y-2">
                    {selectedTask.checklist.map((item, i) => (
                      <label key={i} className="flex items-center gap-2.5 text-sm text-deep-blue-200 cursor-pointer hover:text-white transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded border-deep-blue-600 bg-deep-blue-800 text-neon-purple-500 focus:ring-neon-purple-500" />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Estimated Time */}
                <div className="flex items-center gap-2 text-sm text-deep-blue-400">
                  <Timer className="w-4 h-4" />
                  Estimated: <span className="text-white">{selectedTask.estimated}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedTask.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-deep-blue-800/50 text-xs text-cyber-blue border border-cyber-blue/20">{tag}</span>
                  ))}
                </div>

                {/* Notes */}
                <div>
                  <h4 className="text-xs font-medium text-deep-blue-400 uppercase tracking-wider mb-2">Notes</h4>
                  <textarea
                    placeholder="Add your notes here..."
                    className="w-full px-3 py-2 rounded-xl bg-deep-blue-900/50 border border-deep-blue-700 text-white placeholder-deep-blue-600 text-sm resize-none focus:outline-none focus:border-neon-purple-500 h-20"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Tasks;
