import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Code2,
  Clock,
  UserPlus,
  ExternalLink,
  Sparkles,
  Globe,
  TrendingUp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Community = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [techFilter, setTechFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
    // Track community visit for achievement
    localStorage.setItem('communityVisited', 'true');
  }, []);

  const fetchProjects = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/community/projects`);
      if (response.ok) {
        const data = await response.json();
        // Backend returns { projects: [...], total, page, per_page }
        const projectsList = Array.isArray(data) ? data : (data.projects || []);
        if (projectsList.length > 0) {
          setProjects(projectsList);
          return;
        }
      }
      // If no projects from API, use demo data
      throw new Error('No projects available');
    } catch (error) {
      console.error('Using demo community data:', error.message);
      setProjects([
        {
          id: '1',
          title: 'AI-Powered Resume Analyzer',
          description: 'Building a tool that uses NLP to analyze resumes and provide improvement suggestions.',
          author_name: 'Sarah Chen',
          difficulty_level: 'Intermediate',
          tech_stack: ['Python', 'FastAPI', 'OpenAI', 'React'],
          tags: ['NLP', 'Career', 'Automation'],
          looking_for_collaborators: true,
          max_team_size: 4,
          current_members: 2,
          created_at: '2026-01-28T10:00:00'
        },
        {
          id: '2',
          title: 'Real-time Sign Language Translator',
          description: 'Computer vision project to translate sign language to text in real-time.',
          author_name: 'Marcus Williams',
          difficulty_level: 'Advanced',
          tech_stack: ['Python', 'TensorFlow', 'MediaPipe', 'WebRTC'],
          tags: ['Computer Vision', 'Accessibility', 'Deep Learning'],
          looking_for_collaborators: true,
          max_team_size: 5,
          current_members: 3,
          created_at: '2026-01-27T15:30:00'
        },
        {
          id: '3',
          title: 'Smart Study Buddy Chatbot',
          description: 'An AI chatbot that helps students learn by generating practice questions and explanations.',
          author_name: 'Emily Rodriguez',
          difficulty_level: 'Beginner',
          tech_stack: ['Python', 'LangChain', 'Streamlit', 'Claude API'],
          tags: ['EdTech', 'Chatbot', 'LLM'],
          looking_for_collaborators: true,
          max_team_size: 3,
          current_members: 1,
          created_at: '2026-01-26T09:15:00'
        },
        {
          id: '4',
          title: 'Climate Change Data Visualizer',
          description: 'Interactive dashboard for visualizing and predicting climate patterns using ML.',
          author_name: 'Aiden Park',
          difficulty_level: 'Intermediate',
          tech_stack: ['Python', 'Plotly', 'scikit-learn', 'D3.js'],
          tags: ['Climate', 'Data Viz', 'Prediction'],
          looking_for_collaborators: true,
          max_team_size: 4,
          current_members: 2,
          created_at: '2026-01-25T14:00:00'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinProject = async (projectId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/community/projects/${projectId}/join?member_name=Demo User&member_email=demo@example.com`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error joining project:', error);
    }
  };

  const getDifficultyColor = (level) => {
    const colors = {
      'Beginner': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Intermediate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Advanced': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Expert': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[level] || colors['Intermediate'];
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tech_stack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'all' || project.difficulty_level.toLowerCase() === difficultyFilter;
    const matchesTech = techFilter === 'all' || project.tech_stack.some(t => t.toLowerCase() === techFilter.toLowerCase());
    
    return matchesSearch && matchesDifficulty && matchesTech;
  });

  const allTechStacks = [...new Set(projects.flatMap(p => p.tech_stack))];

  const stats = [
    { icon: Users, value: '60,000+', label: 'Active Students' },
    { icon: Code2, value: `${projects.length}`, label: 'Open Projects' },
    { icon: Globe, value: '50+', label: 'Countries' },
    { icon: TrendingUp, value: '95%', label: 'Success Rate' }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-orb w-96 h-96 bg-neon-purple-600/30 -top-48 -right-48" />
          <div className="floating-orb w-64 h-64 bg-cyber-blue/30 bottom-0 -left-32" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-deep-blue-800/50 border border-neon-purple-500/30 mb-6">
              <Users className="w-4 h-4 text-neon-purple-400" />
              <span className="text-sm text-neon-purple-300">AI-Sana Community</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-white">Build </span>
              <span className="gradient-text">Together</span>
            </h1>

            <p className="text-xl text-deep-blue-300 max-w-2xl mx-auto mb-8">
              Join 60,000+ students collaborating on AI projects. Find teammates, share ideas, and build the future together.
            </p>

            <Link to="/survey">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-5 h-5 mr-2 inline" />
                Start Your Project
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="card-glass p-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-neon-purple-400" />
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-deep-blue-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="card-glass p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-blue-400" />
                <input
                  type="text"
                  placeholder="Search projects, tech stack, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              {/* Difficulty Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-blue-400" />
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="input-field pl-10 pr-8 appearance-none cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Tech Filter */}
              <div className="relative">
                <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-blue-400" />
                <select
                  value={techFilter}
                  onChange={(e) => setTechFilter(e.target.value)}
                  className="input-field pl-10 pr-8 appearance-none cursor-pointer"
                >
                  <option value="all">All Tech</option>
                  {allTechStacks.map((tech) => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-8 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Open Projects
              <span className="text-deep-blue-400 font-normal ml-2">({filteredProjects.length})</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-neon-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-deep-blue-400">Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-deep-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
              <p className="text-deep-blue-400 mb-6">Try adjusting your filters or be the first to publish!</p>
              <Link to="/survey">
                <button className="btn-primary">Create a Project</button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="card-glass p-6 hover:border-neon-purple-500/50 transition-all group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(project.difficulty_level)}`}>
                          {project.difficulty_level}
                        </span>
                        {project.looking_for_collaborators && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-cyber-green/20 text-cyber-green border border-cyber-green/30">
                            Open
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-neon-purple-400 transition-colors">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-deep-blue-300 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-lg bg-deep-blue-800/50 text-xs text-cyber-blue border border-cyber-blue/20"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 4 && (
                      <span className="px-2 py-1 rounded-lg bg-deep-blue-800/50 text-xs text-deep-blue-400">
                        +{project.tech_stack.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-deep-blue-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center text-white text-sm font-bold">
                        {project.author_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{project.author_name}</p>
                        <p className="text-xs text-deep-blue-400 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {project.current_members}/{project.max_team_size} members
                        </p>
                      </div>
                    </div>

                    {project.looking_for_collaborators && project.current_members < project.max_team_size && (
                      <motion.button
                        onClick={() => handleJoinProject(project.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neon-purple-500/20 text-neon-purple-400 text-sm font-medium hover:bg-neon-purple-500/30 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <UserPlus className="w-4 h-4" />
                        Join
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Community;
