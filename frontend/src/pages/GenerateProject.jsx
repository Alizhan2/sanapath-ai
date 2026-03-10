import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Loader2, BrainCircuit, Code2, Target } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { projectsAPI } from '../services/api';
import { useToast } from '../components/Toast';

const GenerateProject = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const [generationStep, setGenerationStep] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGenerationStep('Connecting to server...');
    
    // Create AbortController with 90s timeout — signal is passed to fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    try {
      // Simulate progress steps for better UX
      const stepTimer1 = setTimeout(() => setGenerationStep('AI is analyzing your request...'), 2000);
      const stepTimer2 = setTimeout(() => setGenerationStep('Generating project structure & roadmap...'), 6000);
      const stepTimer3 = setTimeout(() => setGenerationStep('Building detailed week-by-week plan...'), 12000);
      const stepTimer4 = setTimeout(() => setGenerationStep('Almost done, finalizing project...'), 20000);

      const projectData = await projectsAPI.generateProject(prompt, controller.signal);
      
      // Clear all timers
      clearTimeout(timeoutId);
      [stepTimer1, stepTimer2, stepTimer3, stepTimer4].forEach(clearTimeout);
      
      setGenerationStep('Saving project to your dashboard...');
      const startedProject = await projectsAPI.startProject(projectData);
      
      // Also save to local storage for frontend state
      const savedProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
      savedProjects.push({
        ...projectData,
        id: startedProject.id || Date.now(),
        status: 'active',
        progress: 0,
        startedAt: new Date().toISOString()
      });
      localStorage.setItem('userProjects', JSON.stringify(savedProjects));
      
      toast.success('Project generated successfully!');
      navigate('/dashboard');
    } catch (error) {
      if (error.name === 'AbortError' || error.errorCode === 'TIMEOUT_ERROR') {
        toast.error('Request timed out. The server may be waking up — please try again in 30 seconds.');
      } else {
        toast.error(error.message || 'Failed to generate project. Please try again.');
      }
    } finally {
      clearTimeout(timeoutId);
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const suggestions = [
    "A weather app using React and a free API",
    "A personal finance tracker with Python and FastAPI",
    "An AI chatbot using OpenAI API and Next.js",
    "A machine learning model to predict house prices"
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neon-purple-500/20 text-neon-purple-400 mb-6">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Generate Custom Project
          </h1>
          <p className="text-deep-blue-200 text-lg">
            Describe what you want to build, and our AI will create a complete project plan, tech stack, and step-by-step roadmap for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-glass p-8"
        >
          <form onSubmit={handleGenerate}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-deep-blue-200 mb-2">
                What do you want to build?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., I want to build a full-stack e-commerce store with React, Node.js, and Stripe integration..."
                className="w-full h-32 bg-deep-blue-900/50 border border-deep-blue-700 rounded-xl p-4 text-white placeholder-deep-blue-400 focus:outline-none focus:border-neon-purple-500 focus:ring-1 focus:ring-neon-purple-500 transition-all resize-none"
                disabled={isGenerating}
              />
            </div>

            <div className="mb-8">
              <p className="text-sm text-deep-blue-300 mb-3">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(suggestion)}
                    className="px-4 py-2 rounded-lg bg-deep-blue-800/50 text-deep-blue-200 text-sm hover:bg-deep-blue-700 hover:text-white transition-colors border border-deep-blue-700/50"
                    disabled={isGenerating}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-purple-600 to-cyber-blue text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  {generationStep || 'Generating your project...'}
                </>
              ) : (
                <>
                  <BrainCircuit className="w-6 h-6" />
                  Generate Project Plan
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: Target, title: "Tailored Roadmap", desc: "Get a week-by-week plan customized to your idea" },
            { icon: Code2, title: "Tech Stack", desc: "Optimal tools and frameworks selected for you" },
            { icon: Sparkles, title: "Learning Goals", desc: "Clear objectives to track your skill growth" }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (idx * 0.1) }}
              className="card-glass p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-deep-blue-800/50 text-cyber-blue mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold mb-2">{feature.title}</h3>
              <p className="text-deep-blue-300 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GenerateProject;
