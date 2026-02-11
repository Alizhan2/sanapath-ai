import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGlobalNotifications } from '../context/NotificationContext';
import { recordActivity, recordResourceClick } from '../hooks/useRealStats';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Code2,
  Target,
  Rocket,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  BookOpen,
  ExternalLink,
  Share2,
  Linkedin,
  Copy,
  Check,
  Youtube
} from 'lucide-react';
import Navbar from '../components/Navbar';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useAuth();
  const { notifyTaskComplete, notifyWeekComplete, notifyLinkedInPost } = useGlobalNotifications();
  const [project, setProject] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(0);
  const [completedTasks, setCompletedTasks] = useState({});
  const [linkedInCopied, setLinkedInCopied] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load project from localStorage
    const savedProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    const found = savedProjects.find(p => p.id === projectId);
    
    if (found) {
      setProject(found);
      setCompletedTasks(found.completedTasks || {});
      setExpandedWeek((found.currentWeek || 1) - 1);
    } else {
      navigate('/dashboard');
    }
  }, [projectId, isAuthenticated, loading, navigate]);

  const handleTaskToggle = (weekIndex, taskIndex) => {
    const key = `${weekIndex}-${taskIndex}`;
    const wasCompleted = completedTasks[key];
    const updated = { ...completedTasks, [key]: !completedTasks[key] };
    setCompletedTasks(updated);

    // Send notification for completing a task
    if (!wasCompleted) {
      const task = project.roadmap[weekIndex]?.tasks[taskIndex];
      const taskName = typeof task === 'object' ? task.name : task;
      notifyTaskComplete(taskName);
      recordActivity(1); // Record activity for streak tracking

      // Check if entire week is now complete
      const weekTasks = project.roadmap[weekIndex]?.tasks || [];
      const allDone = weekTasks.every((_, i) => i === taskIndex ? true : updated[`${weekIndex}-${i}`]);
      if (allDone) {
        notifyWeekComplete(weekIndex + 1, project.title);
      }
    }

    // Save to localStorage
    const savedProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    const updatedProjects = savedProjects.map(p => {
      if (p.id === projectId) {
        // Calculate current week based on completed tasks
        const completedCount = Object.values(updated).filter(Boolean).length;
        const totalTasks = project.roadmap.reduce((acc, week) => acc + week.tasks.length, 0);
        const progress = completedCount / totalTasks;
        const currentWeek = Math.min(4, Math.floor(progress * 4) + 1);
        
        return { ...p, completedTasks: updated, currentWeek };
      }
      return p;
    });
    localStorage.setItem('userProjects', JSON.stringify(updatedProjects));
  };

  const getWeekProgress = (weekIndex) => {
    if (!project?.roadmap[weekIndex]) return 0;
    const tasks = project.roadmap[weekIndex].tasks;
    const completed = tasks.filter((_, i) => completedTasks[`${weekIndex}-${i}`]).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getTotalProgress = () => {
    if (!project?.roadmap) return 0;
    const totalTasks = project.roadmap.reduce((acc, week) => acc + week.tasks.length, 0);
    const completed = Object.values(completedTasks).filter(Boolean).length;
    return Math.round((completed / totalTasks) * 100);
  };

  if (loading || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-pattern">
        <div className="w-12 h-12 border-4 border-neon-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-pattern">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-deep-blue-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          {/* Project Header */}
          <motion.div
            className="card-glass p-6 md:p-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.difficulty_level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    project.difficulty_level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    project.difficulty_level === 'Advanced' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {project.difficulty_level}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-deep-blue-700/50 text-deep-blue-200">
                    {project.estimated_duration}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</h1>
                <p className="text-deep-blue-300">{project.description}</p>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech_stack?.map((tech, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-deep-blue-800/50 text-sm text-cyber-blue border border-cyber-blue/20">
                  {tech}
                </span>
              ))}
            </div>

            {/* Overall Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-deep-blue-400">Overall Progress</span>
                <span className="text-white font-medium">{getTotalProgress()}%</span>
              </div>
              <div className="h-3 bg-deep-blue-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getTotalProgress()}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* LinkedIn Share */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  const progress = getTotalProgress();
                  const text = `🚀 I'm working on "${project.title}" using SanaPath AI!\n\n📊 Progress: ${progress}%\n🛠 Tech: ${project.tech_stack?.join(', ')}\n\n${progress >= 100 ? '✅ Project completed!' : `Currently on Week ${Math.min(4, Math.floor(progress / 25) + 1)} of 4.`}\n\n#SanaPathAI #BuildInPublic #LearningInPublic #${project.tech_stack?.[0]?.replace(/[^a-zA-Z]/g, '') || 'Tech'}`;
                  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://sanapath-ai.netlify.app')}&summary=${encodeURIComponent(text)}`;
                  window.open(linkedInUrl, '_blank', 'width=600,height=600');
                  notifyLinkedInPost(project.title);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0077B5]/20 text-[#0077B5] border border-[#0077B5]/30 hover:bg-[#0077B5]/30 transition-colors text-sm font-medium"
              >
                <Linkedin className="w-4 h-4" />
                Share on LinkedIn
              </button>
              <button
                onClick={() => {
                  const progress = getTotalProgress();
                  const text = `🚀 I'm working on "${project.title}" using SanaPath AI!\n\n📊 Progress: ${progress}%\n🛠 Tech: ${project.tech_stack?.join(', ')}\n\n${progress >= 100 ? '✅ Project completed!' : `Currently on Week ${Math.min(4, Math.floor(progress / 25) + 1)} of 4.`}\n\nhttps://sanapath-ai.netlify.app\n\n#SanaPathAI #BuildInPublic`;
                  navigator.clipboard.writeText(text);
                  setLinkedInCopied(true);
                  setTimeout(() => setLinkedInCopied(false), 2000);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-deep-blue-700/50 text-deep-blue-200 border border-deep-blue-600/30 hover:bg-deep-blue-700 transition-colors text-sm font-medium"
              >
                {linkedInCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {linkedInCopied ? 'Copied!' : 'Copy Post Text'}
              </button>
            </div>
          </motion.div>

          {/* Learning Outcomes */}
          {project.learning_outcomes && (
            <motion.div
              className="card-glass p-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-neon-purple-400" />
                Learning Outcomes
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {project.learning_outcomes.map((outcome, i) => (
                  <div key={i} className="flex items-start gap-2 text-deep-blue-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Roadmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyber-blue" />
              4-Week Implementation Roadmap
            </h2>

            <div className="space-y-4">
              {project.roadmap?.map((week, weekIndex) => (
                <div key={weekIndex} className="card-glass overflow-hidden">
                  <button
                    onClick={() => setExpandedWeek(expandedWeek === weekIndex ? -1 : weekIndex)}
                    className="w-full p-4 flex items-center justify-between hover:bg-deep-blue-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        getWeekProgress(weekIndex) === 100
                          ? 'bg-green-500/20 text-green-400'
                          : getWeekProgress(weekIndex) > 0
                          ? 'bg-neon-purple-500/20 text-neon-purple-400'
                          : 'bg-deep-blue-700/50 text-deep-blue-400'
                      }`}>
                        W{weekIndex + 1}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-white">{week.title}</h3>
                        <p className="text-sm text-deep-blue-400">{getWeekProgress(weekIndex)}% complete</p>
                      </div>
                    </div>
                    {expandedWeek === weekIndex ? (
                      <ChevronUp className="w-5 h-5 text-deep-blue-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-deep-blue-400" />
                    )}
                  </button>

                  {expandedWeek === weekIndex && (
                    <motion.div
                      className="px-4 pb-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      {/* Tasks */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-deep-blue-400 mb-3">Tasks:</h4>
                        <div className="space-y-4">
                          {week.tasks?.map((task, taskIndex) => {
                            // Check if task is detailed (object) or simple (string)
                            const isDetailedTask = typeof task === 'object' && task !== null;
                            const taskName = isDetailedTask ? task.name : task;
                            const taskDescription = isDetailedTask ? task.description : null;
                            const taskSteps = isDetailedTask ? task.steps : null;
                            const taskResources = isDetailedTask ? task.resources : null;
                            const taskTime = isDetailedTask ? task.estimated_time : null;

                            return (
                              <div key={taskIndex} className="rounded-xl bg-deep-blue-800/30 border border-deep-blue-700/50 overflow-hidden">
                                {/* Task Header */}
                                <button
                                  onClick={() => handleTaskToggle(weekIndex, taskIndex)}
                                  className="w-full flex items-center gap-3 p-4 hover:bg-deep-blue-800/50 transition-colors text-left"
                                >
                                  {completedTasks[`${weekIndex}-${taskIndex}`] ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                                  ) : (
                                    <Circle className="w-6 h-6 text-deep-blue-500 flex-shrink-0" />
                                  )}
                                  <div className="flex-1">
                                    <span className={`font-medium ${completedTasks[`${weekIndex}-${taskIndex}`] 
                                      ? 'text-deep-blue-400 line-through' 
                                      : 'text-white'
                                    }`}>
                                      {taskName}
                                    </span>
                                    {taskTime && (
                                      <span className="ml-3 text-xs px-2 py-0.5 rounded-full bg-deep-blue-700/50 text-deep-blue-300">
                                        <Clock className="w-3 h-3 inline mr-1" />
                                        {taskTime}
                                      </span>
                                    )}
                                  </div>
                                </button>

                                {/* Task Details (for detailed tasks) */}
                                {isDetailedTask && (
                                  <div className="px-4 pb-4 border-t border-deep-blue-700/30">
                                    {/* Description */}
                                    {taskDescription && (
                                      <p className="text-deep-blue-300 text-sm mt-3 mb-4">{taskDescription}</p>
                                    )}

                                    {/* Steps */}
                                    {taskSteps && taskSteps.length > 0 && (
                                      <div className="mb-4">
                                        <h5 className="text-xs font-semibold text-neon-purple-400 uppercase tracking-wider mb-2">
                                          Step-by-Step Guide:
                                        </h5>
                                        <ol className="space-y-2 list-decimal list-inside">
                                          {taskSteps.map((step, stepIndex) => (
                                            <li key={stepIndex} className="text-sm text-deep-blue-200 pl-2">
                                              <span className="text-deep-blue-300">{step}</span>
                                            </li>
                                          ))}
                                        </ol>
                                      </div>
                                    )}

                                    {/* Resources */}
                                    {taskResources && taskResources.length > 0 && (
                                      <div>
                                        {/* Video Tutorials - prominent section */}
                                        {taskResources.filter(r => r.type === 'video').length > 0 && (
                                          <div className="mb-4">
                                            <h5 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                              <Youtube className="w-4 h-4" />
                                              Video Tutorials:
                                            </h5>
                                            <div className="grid gap-3">
                                              {taskResources.filter(r => r.type === 'video').map((resource, resIndex) => {
                                                // Extract YouTube video ID for thumbnail
                                                const videoId = resource.url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
                                                return (
                                                  <a
                                                    key={resIndex}
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => recordResourceClick(resource.url)}
                                                    className="group flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/15 hover:border-red-500/40 transition-all"
                                                  >
                                                    {/* YouTube Thumbnail */}
                                                    {videoId ? (
                                                      <div className="relative flex-shrink-0 w-28 h-16 rounded-lg overflow-hidden bg-deep-blue-800">
                                                        <img 
                                                          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                                          alt={resource.title}
                                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                                                          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                                                            <Play className="w-4 h-4 text-white ml-0.5" />
                                                          </div>
                                                        </div>
                                                      </div>
                                                    ) : (
                                                      <div className="flex-shrink-0 w-28 h-16 rounded-lg bg-red-500/20 flex items-center justify-center">
                                                        <Play className="w-6 h-6 text-red-400" />
                                                      </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                      <p className="text-sm font-medium text-white group-hover:text-red-300 transition-colors truncate">
                                                        {resource.title}
                                                      </p>
                                                      <p className="text-xs text-deep-blue-400 mt-0.5">
                                                        📺 Watch on YouTube
                                                      </p>
                                                    </div>
                                                    <ExternalLink className="w-4 h-4 text-deep-blue-500 group-hover:text-red-400 flex-shrink-0 transition-colors" />
                                                  </a>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}

                                        {/* Other Resources (docs, tutorials, articles) */}
                                        {taskResources.filter(r => r.type !== 'video').length > 0 && (
                                          <div>
                                            <h5 className="text-xs font-semibold text-cyber-blue uppercase tracking-wider mb-2 flex items-center gap-1">
                                              <BookOpen className="w-3 h-3" />
                                              Documentation & Articles:
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                              {taskResources.filter(r => r.type !== 'video').map((resource, resIndex) => (
                                                <a
                                                  key={resIndex}
                                                  href={resource.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  onClick={() => recordResourceClick(resource.url)}
                                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                                                    resource.type === 'docs' 
                                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20'
                                                    : resource.type === 'tutorial'
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                                                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20'
                                                  }`}
                                                >
                                                  {resource.type === 'docs' && '📖'}
                                                  {resource.type === 'tutorial' && '📝'}
                                                  {resource.type === 'article' && '📰'}
                                                  {resource.title}
                                                  <ExternalLink className="w-3 h-3" />
                                                </a>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Fallback for simple string tasks - show YouTube search link */}
                                {!isDetailedTask && (
                                  <div className="px-4 pb-3 border-t border-deep-blue-700/30">
                                    <a
                                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(taskName + ' tutorial')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={() => recordResourceClick('youtube-search-' + taskName)}
                                      className="inline-flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-xs font-medium"
                                    >
                                      <Youtube className="w-4 h-4" />
                                      Find Video Tutorial
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Deliverables */}
                      {week.deliverables && (
                        <div>
                          <h4 className="text-sm font-medium text-deep-blue-400 mb-2">Deliverables:</h4>
                          <div className="flex flex-wrap gap-2">
                            {week.deliverables.map((deliverable, i) => (
                              <span key={i} className="px-3 py-1 rounded-lg bg-green-500/10 text-green-400 text-sm border border-green-500/20">
                                ✓ {deliverable}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
