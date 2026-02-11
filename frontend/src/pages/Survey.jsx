import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  User, 
  Code2, 
  Sparkles, 
  Target, 
  Clock,
  Loader2
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Survey = ({ setRecommendations, setUserData }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    university: '',
    // Technical Skills
    programming_languages: [],
    skill_level: '',
    ai_ml_experience: '',
    // Interests
    interest_areas: [],
    preferred_project_type: '',
    industry_interest: [],
    // Goals
    career_goal: '',
    learning_style: '',
    // Time & Collaboration
    time_commitment: '',
    project_duration: '',
    team_preference: '',
    collaboration_tools: []
  });

  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      subtitle: "Let's start with the basics",
      icon: User,
      fields: [
        { id: 'name', type: 'text', label: "What's your name?", placeholder: 'John Doe', required: true },
        { id: 'email', type: 'email', label: 'Your email address', placeholder: 'john@university.edu', required: true },
        { id: 'university', type: 'text', label: 'University/Institution (optional)', placeholder: 'MIT, Stanford, etc.', required: false }
      ]
    },
    {
      id: 'skills',
      title: 'Technical Skills',
      subtitle: 'Tell us about your programming background',
      icon: Code2,
      fields: [
        {
          id: 'programming_languages',
          type: 'multiselect',
          label: 'Which programming languages do you know?',
          options: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'R', 'SQL', 'Other'],
          required: true
        },
        {
          id: 'skill_level',
          type: 'select',
          label: "What's your overall programming skill level?",
          options: [
            { value: 'beginner', label: '🌱 Beginner - Just starting out' },
            { value: 'intermediate', label: '🌿 Intermediate - Comfortable with basics' },
            { value: 'advanced', label: '🌳 Advanced - Built multiple projects' },
            { value: 'expert', label: '🏆 Expert - Professional experience' }
          ],
          required: true
        },
        {
          id: 'ai_ml_experience',
          type: 'select',
          label: 'Describe your AI/ML experience',
          options: [
            { value: 'No experience - just getting started', label: '🆕 No experience - just getting started' },
            { value: 'Basic - completed tutorials/courses', label: '📚 Basic - completed tutorials/courses' },
            { value: 'Intermediate - built small projects', label: '🔨 Intermediate - built small projects' },
            { value: 'Advanced - deployed production models', label: '🚀 Advanced - deployed production models' },
            { value: 'Expert - research/published work', label: '🎓 Expert - research/published work' }
          ],
          required: true
        }
      ]
    },
    {
      id: 'interests',
      title: 'Interests & Focus',
      subtitle: 'What excites you in AI?',
      icon: Sparkles,
      fields: [
        {
          id: 'interest_areas',
          type: 'multiselect',
          label: 'Select your areas of interest in AI',
          options: [
            'Natural Language Processing',
            'Computer Vision',
            'Reinforcement Learning',
            'Generative AI',
            'MLOps & Deployment',
            'Data Engineering',
            'Robotics & Automation',
            'Healthcare AI',
            'Finance & Trading AI',
            'Conversational AI'
          ],
          required: true
        },
        {
          id: 'preferred_project_type',
          type: 'select',
          label: 'What type of project appeals to you?',
          options: [
            { value: 'Research-focused (papers, experiments)', label: '🔬 Research-focused (papers, experiments)' },
            { value: 'Product-focused (build & ship)', label: '📦 Product-focused (build & ship)' },
            { value: 'Open-source contribution', label: '🌐 Open-source contribution' },
            { value: 'Startup/entrepreneurial', label: '🚀 Startup/entrepreneurial' },
            { value: 'Social impact & non-profit', label: '💚 Social impact & non-profit' }
          ],
          required: true
        },
        {
          id: 'industry_interest',
          type: 'multiselect',
          label: 'Which industries interest you?',
          options: [
            'Healthcare & Biotech',
            'Finance & Fintech',
            'Education & EdTech',
            'E-commerce & Retail',
            'Gaming & Entertainment',
            'Climate & Sustainability',
            'Transportation & Logistics',
            'Manufacturing & Industry 4.0'
          ],
          required: true
        }
      ]
    },
    {
      id: 'goals',
      title: 'Goals & Learning',
      subtitle: 'Where do you want to go?',
      icon: Target,
      fields: [
        {
          id: 'career_goal',
          type: 'select',
          label: "What's your primary career goal?",
          options: [
            { value: 'ML Engineer at a tech company', label: '🏢 ML Engineer at a tech company' },
            { value: 'Data Scientist', label: '📊 Data Scientist' },
            { value: 'AI Researcher (academia)', label: '🎓 AI Researcher (academia)' },
            { value: 'Startup Founder', label: '🦄 Startup Founder' },
            { value: 'Full-stack AI Developer', label: '💻 Full-stack AI Developer' },
            { value: 'AI Product Manager', label: '📋 AI Product Manager' },
            { value: 'Freelance AI Consultant', label: '🌍 Freelance AI Consultant' }
          ],
          required: true
        },
        {
          id: 'learning_style',
          type: 'select',
          label: 'How do you prefer to learn?',
          options: [
            { value: 'Learning by doing (build first)', label: '🛠️ Learning by doing (build first)' },
            { value: 'Theory first, then practice', label: '📖 Theory first, then practice' },
            { value: 'Video tutorials & courses', label: '🎬 Video tutorials & courses' },
            { value: 'Reading documentation & papers', label: '📄 Reading documentation & papers' },
            { value: 'Peer learning & collaboration', label: '👥 Peer learning & collaboration' }
          ],
          required: true
        }
      ]
    },
    {
      id: 'availability',
      title: 'Time & Collaboration',
      subtitle: "Let's plan your journey",
      icon: Clock,
      fields: [
        {
          id: 'time_commitment',
          type: 'select',
          label: 'How many hours per week can you dedicate?',
          options: [
            { value: 'Less than 5 hours', label: '⏰ Less than 5 hours' },
            { value: '5-10 hours', label: '⏰ 5-10 hours' },
            { value: '10-20 hours', label: '⏰ 10-20 hours' },
            { value: '20-30 hours', label: '⏰ 20-30 hours' },
            { value: 'Full-time (30+ hours)', label: '⏰ Full-time (30+ hours)' }
          ],
          required: true
        },
        {
          id: 'project_duration',
          type: 'select',
          label: 'Preferred project duration',
          options: [
            { value: '1-2 weeks (quick win)', label: '🏃 1-2 weeks (quick win)' },
            { value: '3-4 weeks (standard)', label: '🚶 3-4 weeks (standard)' },
            { value: '1-2 months (substantial)', label: '🎯 1-2 months (substantial)' },
            { value: '3+ months (long-term)', label: '🏔️ 3+ months (long-term)' }
          ],
          required: true
        },
        {
          id: 'team_preference',
          type: 'select',
          label: 'Do you prefer working solo or in a team?',
          options: [
            { value: 'Solo - I like independence', label: '🧑‍💻 Solo - I like independence' },
            { value: 'Small team (2-3 people)', label: '👥 Small team (2-3 people)' },
            { value: 'Larger team (4-6 people)', label: '👨‍👩‍👧‍👦 Larger team (4-6 people)' },
            { value: 'Flexible - depends on the project', label: '🔄 Flexible - depends on the project' }
          ],
          required: true
        },
        {
          id: 'collaboration_tools',
          type: 'multiselect',
          label: 'Which tools are you comfortable with?',
          options: ['Git/GitHub', 'Slack', 'Discord', 'Notion', 'Jira', 'Linear', 'Google Workspace', 'VS Code Live Share'],
          required: true
        }
      ]
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleMultiSelectToggle = (fieldId, value) => {
    setFormData(prev => {
      const current = prev[fieldId] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [fieldId]: updated };
    });
  };

  const isStepValid = () => {
    return currentStepData.fields.every(field => {
      if (!field.required) return true;
      const value = formData[field.id];
      if (field.type === 'multiselect') {
        return value && value.length > 0;
      }
      return value && value.trim() !== '';
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/survey/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }

      const data = await response.json();
      setRecommendations(data);
      setUserData(formData);
      navigate('/recommendations');
    } catch (error) {
      console.error('Error submitting survey:', error);
      // For demo purposes, create mock data if API fails
      const mockRecommendations = {
        student_name: formData.name,
        personalization_summary: `Based on your interest in ${formData.interest_areas.join(', ')} and goal to become a ${formData.career_goal}, we've curated these projects for you.`,
        recommendations: [
          {
            title: 'AI-Powered Code Review Assistant',
            description: 'Build an intelligent code review tool that analyzes pull requests and provides actionable feedback using LLMs.',
            difficulty_level: 'Intermediate',
            tech_stack: ['Python', 'FastAPI', 'OpenAI API', 'GitHub Actions'],
            estimated_duration: '4 weeks',
            learning_outcomes: ['LLM Integration', 'API Development', 'CI/CD Automation'],
            tags: ['NLP', 'Developer Tools', 'Automation'],
            roadmap: [
              { week: 1, title: 'Foundation', tasks: ['Set up project', 'Learn OpenAI API'], deliverables: ['Working API client'] },
              { week: 2, title: 'Core Logic', tasks: ['Build analysis engine', 'Create prompts'], deliverables: ['Analysis module'] },
              { week: 3, title: 'Integration', tasks: ['GitHub webhook', 'FastAPI endpoints'], deliverables: ['Working bot'] },
              { week: 4, title: 'Polish', tasks: ['Testing', 'Documentation'], deliverables: ['Production-ready tool'] }
            ]
          },
          {
            title: 'Personalized Learning Path Generator',
            description: 'Create an AI system that generates customized learning paths based on career goals and current skills.',
            difficulty_level: 'Intermediate',
            tech_stack: ['Python', 'LangChain', 'React', 'PostgreSQL'],
            estimated_duration: '4 weeks',
            learning_outcomes: ['RAG Systems', 'Full-stack Development', 'Personalization Algorithms'],
            tags: ['EdTech', 'Personalization', 'LLM'],
            roadmap: [
              { week: 1, title: 'Research', tasks: ['Study RAG patterns', 'Design schema'], deliverables: ['Architecture doc'] },
              { week: 2, title: 'Backend', tasks: ['Build API', 'LangChain setup'], deliverables: ['API endpoints'] },
              { week: 3, title: 'Frontend', tasks: ['React UI', 'User flows'], deliverables: ['Working UI'] },
              { week: 4, title: 'Launch', tasks: ['Integration', 'Testing'], deliverables: ['Deployed app'] }
            ]
          },
          {
            title: 'Real-time Sentiment Analysis Dashboard',
            description: 'Build a dashboard that analyzes social media sentiment in real-time using streaming NLP.',
            difficulty_level: 'Advanced',
            tech_stack: ['Python', 'Kafka', 'Transformers', 'Grafana'],
            estimated_duration: '4 weeks',
            learning_outcomes: ['Stream Processing', 'NLP Models', 'Data Visualization'],
            tags: ['NLP', 'Real-time', 'Analytics'],
            roadmap: [
              { week: 1, title: 'Setup', tasks: ['Kafka cluster', 'Data pipeline'], deliverables: ['Streaming infra'] },
              { week: 2, title: 'ML Model', tasks: ['Fine-tune BERT', 'Batch processing'], deliverables: ['Trained model'] },
              { week: 3, title: 'Integration', tasks: ['Connect streams', 'Build API'], deliverables: ['Real-time feed'] },
              { week: 4, title: 'Dashboard', tasks: ['Grafana setup', 'Alerts'], deliverables: ['Live dashboard'] }
            ]
          },
          {
            title: 'Multi-modal Document Understanding',
            description: 'Create a system that can understand and answer questions about documents with text, images, and tables.',
            difficulty_level: 'Advanced',
            tech_stack: ['Python', 'GPT-4V', 'LangChain', 'Pinecone'],
            estimated_duration: '4 weeks',
            learning_outcomes: ['Multi-modal AI', 'Vector Databases', 'Document Processing'],
            tags: ['Computer Vision', 'NLP', 'Enterprise'],
            roadmap: [
              { week: 1, title: 'Pipeline', tasks: ['Document parsing', 'OCR setup'], deliverables: ['Parser module'] },
              { week: 2, title: 'Embeddings', tasks: ['Vector store', 'Multi-modal embed'], deliverables: ['Search system'] },
              { week: 3, title: 'QA System', tasks: ['RAG implementation', 'Vision queries'], deliverables: ['QA endpoint'] },
              { week: 4, title: 'Refinement', tasks: ['Accuracy tuning', 'UI'], deliverables: ['Complete system'] }
            ]
          },
          {
            title: 'AI Meeting Assistant',
            description: 'Build an assistant that transcribes meetings, extracts action items, and generates summaries.',
            difficulty_level: 'Intermediate',
            tech_stack: ['Python', 'Whisper', 'Claude API', 'Next.js'],
            estimated_duration: '4 weeks',
            learning_outcomes: ['Speech Recognition', 'Information Extraction', 'Web Development'],
            tags: ['Productivity', 'Speech', 'Automation'],
            roadmap: [
              { week: 1, title: 'Transcription', tasks: ['Whisper setup', 'Audio processing'], deliverables: ['Transcription service'] },
              { week: 2, title: 'Analysis', tasks: ['Action extraction', 'Summary generation'], deliverables: ['Analysis module'] },
              { week: 3, title: 'Frontend', tasks: ['Next.js app', 'Real-time display'], deliverables: ['Web interface'] },
              { week: 4, title: 'Features', tasks: ['Calendar integration', 'Export'], deliverables: ['Full product'] }
            ]
          }
        ]
      };
      setRecommendations(mockRecommendations);
      setUserData(formData);
      navigate('/recommendations');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            className="input-field"
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );

      case 'select':
        return (
          <div className="grid gap-3">
            {field.options.map((option) => {
              const value = typeof option === 'string' ? option : option.value;
              const label = typeof option === 'string' ? option : option.label;
              const isSelected = formData[field.id] === value;

              return (
                <motion.button
                  key={value}
                  type="button"
                  onClick={() => handleInputChange(field.id, value)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-neon-purple-500/20 to-cyber-blue/20 border-2 border-neon-purple-500'
                      : 'bg-deep-blue-800/50 border-2 border-deep-blue-700/50 hover:border-deep-blue-500'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center justify-between">
                    <span className={isSelected ? 'text-white' : 'text-deep-blue-200'}>
                      {label}
                    </span>
                    {isSelected && (
                      <Check className="w-5 h-5 text-neon-purple-400" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        );

      case 'multiselect':
        return (
          <div className="grid grid-cols-2 gap-3">
            {field.options.map((option) => {
              const isSelected = (formData[field.id] || []).includes(option);

              return (
                <motion.button
                  key={option}
                  type="button"
                  onClick={() => handleMultiSelectToggle(field.id, option)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-neon-purple-500/20 to-cyber-blue/20 border-2 border-neon-purple-500'
                      : 'bg-deep-blue-800/50 border-2 border-deep-blue-700/50 hover:border-deep-blue-500'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'bg-neon-purple-500 border-neon-purple-500' 
                        : 'border-deep-blue-500'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm ${isSelected ? 'text-white' : 'text-deep-blue-200'}`}>
                      {option}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-deep-blue-300">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-neon-purple-400">
                {Math.round(progress)}% complete
              </span>
            </div>
            <div className="h-2 bg-deep-blue-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              return (
                <motion.div
                  key={step.id}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                    isCompleted
                      ? 'bg-neon-purple-500'
                      : isCurrent
                      ? 'bg-gradient-to-r from-neon-purple-500 to-cyber-blue'
                      : 'bg-deep-blue-800 border-2 border-deep-blue-700'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-deep-blue-500'}`} />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Form Card */}
          <motion.div
            className="card-glass p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple-500/20 to-cyber-blue/20 mb-4">
                    <currentStepData.icon className="w-8 h-8 text-neon-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{currentStepData.title}</h2>
                  <p className="text-deep-blue-300">{currentStepData.subtitle}</p>
                </div>

                {/* Fields */}
                <div className="space-y-6">
                  {currentStepData.fields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-white mb-3">
                        {field.label}
                        {field.required && <span className="text-cyber-pink ml-1">*</span>}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-deep-blue-700/50">
              <motion.button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentStep === 0
                    ? 'text-deep-blue-600 cursor-not-allowed'
                    : 'text-deep-blue-300 hover:text-white hover:bg-deep-blue-800'
                }`}
                whileHover={currentStep > 0 ? { scale: 1.02 } : {}}
                whileTap={currentStep > 0 ? { scale: 0.98 } : {}}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </motion.button>

              {currentStep < steps.length - 1 ? (
                <motion.button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    isStepValid()
                      ? 'bg-gradient-to-r from-neon-purple-500 to-cyber-blue text-white hover:shadow-lg hover:shadow-neon-purple-500/25'
                      : 'bg-deep-blue-700 text-deep-blue-500 cursor-not-allowed'
                  }`}
                  whileHover={isStepValid() ? { scale: 1.02 } : {}}
                  whileTap={isStepValid() ? { scale: 0.98 } : {}}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all ${
                    isStepValid() && !isSubmitting
                      ? 'bg-gradient-to-r from-neon-purple-500 to-cyber-blue text-white hover:shadow-lg hover:shadow-neon-purple-500/25'
                      : 'bg-deep-blue-700 text-deep-blue-500 cursor-not-allowed'
                  }`}
                  whileHover={isStepValid() && !isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={isStepValid() && !isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Finding Projects...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Get My Projects</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Question Count */}
          <p className="text-center text-deep-blue-500 text-sm mt-4">
            15 questions total • Your data helps us personalize recommendations
          </p>
        </div>
      </div>
    </div>
  );
};

export default Survey;
