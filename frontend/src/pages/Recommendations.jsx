import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Code2,
  Target,
  BookOpen,
  Calendar,
  Users,
  Linkedin,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  Rocket,
  ExternalLink
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { recordActivity } from '../hooks/useRealStats';

const Recommendations = ({ recommendations, userData }) => {
  const navigate = useNavigate();
  const [expandedProject, setExpandedProject] = useState(0);
  const [copiedLinkedIn, setCopiedLinkedIn] = useState(null);
  const [publishingProject, setPublishingProject] = useState(null);
  const [startedProjects, setStartedProjects] = useState([]);

  // Load started projects on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('userProjects') || '[]');
    setStartedProjects(saved.map(p => p.title));
  }, []);

  const handleStartProject = (project) => {
    // Create project with unique ID
    const newProject = {
      id: `project-${Date.now()}`,
      ...project,
      status: 'active',
      currentWeek: 1,
      completedTasks: {},
      startedAt: new Date().toISOString()
    };

    // Save to localStorage
    const savedProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    
    // Check if already exists
    if (savedProjects.some(p => p.title === project.title)) {
      navigate('/dashboard');
      return;
    }
    
    savedProjects.push(newProject);
    localStorage.setItem('userProjects', JSON.stringify(savedProjects));
    setStartedProjects([...startedProjects, project.title]);
    recordActivity(1); // Track starting a project
    
    // Navigate to project detail
    navigate(`/project/${newProject.id}`);
  };

  if (!recommendations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-neon-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No recommendations yet</h2>
          <p className="text-deep-blue-300 mb-6">Complete the survey to get personalized project ideas</p>
          <Link to="/survey">
            <button className="btn-primary">Take the Survey</button>
          </Link>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (level) => {
    const colors = {
      'Beginner': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Intermediate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Advanced': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Expert': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[level] || colors['Intermediate'];
  };

  const generateLinkedInPost = async (project) => {
    const techTags = project.tech_stack.slice(0, 5).map(t => `#${t.replace(/[^a-zA-Z0-9]/g, '')}`).join(' ');
    
    const post = `🚀 Excited to announce that I'm starting a new AI project!

📌 Project: ${project.title}
🎯 Difficulty: ${project.difficulty_level}
💻 Tech Stack: ${project.tech_stack.join(', ')}

I'm embarking on this journey through the SanaPath AI platform, joining 60,000+ students in the AI-Sana ecosystem who are building real-world AI solutions.

Looking forward to sharing my progress and connecting with fellow AI enthusiasts!

${techTags} #AI #MachineLearning #SanaPathAI #AISana #BuildInPublic

---
🔗 Discover your personalized AI project at SanaPath AI`;

    return post;
  };

  const handleCopyLinkedIn = async (project, index) => {
    const post = await generateLinkedInPost(project);
    await navigator.clipboard.writeText(post);
    setCopiedLinkedIn(index);
    setTimeout(() => setCopiedLinkedIn(null), 2000);
  };

  const handlePublishToCommunity = async (project) => {
    setPublishingProject(project.title);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/community/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: project,
          author_name: userData?.name || 'Anonymous',
          author_email: userData?.email || 'anonymous@example.com',
          looking_for_collaborators: true,
          max_team_size: 4
        })
      });

      if (response.ok) {
        setTimeout(() => {
          navigate('/community');
        }, 500);
      }
    } catch (error) {
      console.error('Error publishing project:', error);
    } finally {
      setPublishingProject(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              to="/survey"
              className="inline-flex items-center gap-2 text-deep-blue-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Survey</span>
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple-500/20 border border-neon-purple-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-neon-purple-400" />
              <span className="text-sm text-neon-purple-300">AI-Powered Recommendations</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Your Personalized </span>
              <span className="gradient-text">Projects</span>
            </h1>

            <p className="text-xl text-deep-blue-300 max-w-2xl mx-auto">
              Hey {recommendations.student_name}! {recommendations.personalization_summary}
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="space-y-6">
            {recommendations.recommendations.map((project, index) => (
              <motion.div
                key={index}
                className="card-glass overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Project Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-deep-blue-800/30 transition-colors"
                  onClick={() => setExpandedProject(expandedProject === index ? -1 : index)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(project.difficulty_level)}`}>
                          {project.difficulty_level}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-deep-blue-700/50 text-deep-blue-200">
                          {project.estimated_duration}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">
                        {project.title}
                      </h3>

                      <p className="text-deep-blue-300 mb-4">
                        {project.description}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack.map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-lg bg-deep-blue-800/50 text-sm text-cyber-blue border border-cyber-blue/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button className="p-2 rounded-lg hover:bg-deep-blue-700/50 transition-colors">
                      {expandedProject === index ? (
                        <ChevronUp className="w-6 h-6 text-deep-blue-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-deep-blue-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedProject === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-deep-blue-700/50"
                    >
                      <div className="p-6 space-y-6">
                        {/* Learning Outcomes */}
                        <div>
                          <h4 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                            <Target className="w-5 h-5 text-neon-purple-400" />
                            Learning Outcomes
                          </h4>
                          <ul className="grid md:grid-cols-2 gap-2">
                            {project.learning_outcomes.map((outcome, i) => (
                              <li key={i} className="flex items-center gap-2 text-deep-blue-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue" />
                                {outcome}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 4-Week Roadmap */}
                        <div>
                          <h4 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                            <Calendar className="w-5 h-5 text-neon-purple-400" />
                            4-Week Implementation Roadmap
                          </h4>
                          <div className="grid md:grid-cols-4 gap-4">
                            {project.roadmap.map((week) => (
                              <div
                                key={week.week}
                                className="p-4 rounded-xl bg-deep-blue-800/30 border border-deep-blue-700/50"
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center text-white font-bold text-sm">
                                    W{week.week}
                                  </div>
                                  <span className="font-medium text-white text-sm">{week.title}</span>
                                </div>
                                <div className="space-y-2">
                                  <div>
                                    <p className="text-xs text-deep-blue-400 mb-1">Tasks:</p>
                                    <ul className="space-y-1">
                                      {week.tasks.map((task, i) => (
                                        <li key={i} className="text-xs text-deep-blue-300 flex items-start gap-1">
                                          <span className="text-neon-purple-400">•</span>
                                          {task}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="text-xs text-deep-blue-400 mb-1">Deliverables:</p>
                                    <ul className="space-y-1">
                                      {week.deliverables.map((del, i) => (
                                        <li key={i} className="text-xs text-cyber-blue flex items-start gap-1">
                                          <Check className="w-3 h-3 mt-0.5" />
                                          {del}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tags */}
                        <div>
                          <h4 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                            <BookOpen className="w-5 h-5 text-neon-purple-400" />
                            Tags
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 rounded-full bg-neon-purple-500/10 text-sm text-neon-purple-300 border border-neon-purple-500/20"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-deep-blue-700/50">
                          <motion.button
                            onClick={() => handlePublishToCommunity(project)}
                            disabled={publishingProject === project.title}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-purple-500 to-cyber-blue text-white font-medium hover:shadow-lg hover:shadow-neon-purple-500/25 transition-all disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Users className="w-4 h-4" />
                            {publishingProject === project.title ? 'Publishing...' : 'Publish to Community'}
                          </motion.button>

                          <motion.button
                            onClick={() => handleCopyLinkedIn(project, index)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0077B5]/20 border border-[#0077B5]/50 text-[#0077B5] font-medium hover:bg-[#0077B5]/30 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {copiedLinkedIn === index ? (
                              <>
                                <Check className="w-4 h-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy Post
                              </>
                            )}
                          </motion.button>

                          <motion.button
                            onClick={async () => {
                              const post = await generateLinkedInPost(project);
                              const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://sanapath-ai.netlify.app')}&summary=${encodeURIComponent(post)}`;
                              window.open(linkedInUrl, '_blank', 'width=600,height=600');
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0077B5] text-white font-medium hover:bg-[#0077B5]/80 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Linkedin className="w-4 h-4" />
                            Share on LinkedIn
                          </motion.button>

                          <motion.button
                            onClick={() => handleStartProject(project)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/50 text-green-400 font-medium hover:bg-green-500/30 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Rocket className="w-4 h-4" />
                            Start Project
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-deep-blue-400 mb-4">
              Want to see your projects?
            </p>
            <Link to="/dashboard">
              <button className="btn-secondary">
                Go to Dashboard
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
