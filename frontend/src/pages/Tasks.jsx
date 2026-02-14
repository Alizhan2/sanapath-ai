import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { useRoadmapData } from '../hooks/useRoadmapData';
import {
  CheckCircle2, Circle, Tag, Calendar, ChevronRight,
  X, FileText, Timer, CheckSquare, Search
} from 'lucide-react';

const filters = ['All tasks', 'This week', 'This month', 'By step'];
const statusColors = {
  'done': 'bg-green-500/20 text-green-400',
  'in-progress': 'bg-yellow-500/20 text-yellow-400',
  'todo': 'bg-deep-blue-700 text-deep-blue-300',
};
const statusLabels = { 'done': 'Done', 'in-progress': 'In Progress', 'todo': 'To Do' };

const Tasks = () => {
  const { allTasks, toggleTaskStatus } = useRoadmapData();
  const [activeFilter, setActiveFilter] = useState('All tasks');
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = allTasks.filter(t => {
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilter === 'This week') return new Date(t.due) <= new Date(Date.now() + 7 * 86400000);
    if (activeFilter === 'This month') return new Date(t.due).getMonth() === new Date().getMonth();
    return true;
  });

  const grouped = activeFilter === 'By step'
    ? Object.entries(filtered.reduce((acc, t) => { (acc[`Step ${t.step}`] = acc[`Step ${t.step}`] || []).push(t); return acc; }, {}))
    : [['', filtered]];

  // Keep selected task in sync after toggle
  const currentSelected = selectedTask ? allTasks.find(t => t.id === selectedTask.id) || selectedTask : null;

  return (
    <DashboardLayout>
      <div className="flex gap-6 min-h-[calc(100vh-5rem)]">
        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Tasks</h1>
            <p className="text-deep-blue-400 text-sm">
              Manage your roadmap tasks and track progress ·{' '}
              <span className="text-neon-purple-400">{allTasks.filter(t => t.status === 'done').length}/{allTasks.length} completed</span>
            </p>
          </motion.div>

          {/* Filters + Search */}
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex gap-2 flex-wrap">
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
                        currentSelected?.id === task.id ? 'border-neon-purple-500/50' : ''
                      }`}
                    >
                      <button onClick={e => { e.stopPropagation(); toggleTaskStatus(task.id); }}>
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
                        <span className="text-xs text-deep-blue-500 flex items-center gap-1 hidden sm:flex">
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
            {filtered.length === 0 && (
              <div className="card-glass p-12 text-center">
                <p className="text-deep-blue-400">No tasks match your filter</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Drawer — Task Detail */}
        <AnimatePresence>
          {currentSelected && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="w-96 flex-shrink-0 hidden lg:block"
            >
              <div className="card-glass p-6 sticky top-6 space-y-5">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-white pr-4">{currentSelected.title}</h3>
                  <button onClick={() => setSelectedTask(null)} className="p-1.5 rounded-lg hover:bg-deep-blue-700 text-deep-blue-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[currentSelected.status]}`}>
                  {statusLabels[currentSelected.status]}
                </span>

                <div>
                  <h4 className="text-xs font-medium text-deep-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Description
                  </h4>
                  <p className="text-sm text-deep-blue-200 leading-relaxed">{currentSelected.description}</p>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-deep-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <CheckSquare className="w-3 h-3" /> Checklist
                  </h4>
                  <div className="space-y-2">
                    {currentSelected.checklist.map((item, i) => (
                      <label key={i} className="flex items-center gap-2.5 text-sm text-deep-blue-200 cursor-pointer hover:text-white transition-colors">
                        <input type="checkbox" defaultChecked={currentSelected.status === 'done'} className="w-4 h-4 rounded border-deep-blue-600 bg-deep-blue-800 text-neon-purple-500 focus:ring-neon-purple-500" />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-deep-blue-400">
                  <Timer className="w-4 h-4" />
                  Estimated: <span className="text-white">{currentSelected.estimated}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentSelected.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-deep-blue-800/50 text-xs text-cyber-blue border border-cyber-blue/20">{tag}</span>
                  ))}
                </div>

                <div className="text-xs text-deep-blue-500">
                  Step {currentSelected.step} · Due {new Date(currentSelected.due).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>

                <button
                  onClick={() => toggleTaskStatus(currentSelected.id)}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                    currentSelected.status === 'done'
                      ? 'bg-deep-blue-800 text-deep-blue-300 hover:bg-deep-blue-700'
                      : 'btn-primary'
                  }`}
                >
                  {currentSelected.status === 'done' ? 'Mark as To Do' : 'Mark as Done ✓'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Tasks;
