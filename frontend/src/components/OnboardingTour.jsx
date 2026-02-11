import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Brain, BarChart3, Award, Users, MessageCircle,
  ChevronRight, ChevronLeft, X, Sparkles
} from 'lucide-react';

const tourSteps = [
  {
    icon: Sparkles,
    title: 'Welcome to SanaPath AI! 🚀',
    description: 'Your personal AI-powered platform for discovering and building real-world AI projects. Let me show you around!',
    color: 'from-neon-purple-500 to-cyber-blue',
    tip: 'Part of the AI-Sana ecosystem with 60,000+ students'
  },
  {
    icon: Brain,
    title: 'Take the AI Survey',
    description: 'Answer 15 quick questions about your skills, interests, and goals. Our AI will generate 5 personalized project recommendations just for you.',
    color: 'from-blue-500 to-cyan-500',
    tip: 'Go to Survey from the navigation bar'
  },
  {
    icon: Rocket,
    title: 'Start Building Projects',
    description: 'Each project comes with a 4-week roadmap, step-by-step tasks, video tutorials, and learning resources. Check off tasks as you complete them!',
    color: 'from-green-500 to-emerald-500',
    tip: 'Click "Start Project" on any recommendation'
  },
  {
    icon: BarChart3,
    title: 'Track Your Progress',
    description: 'Your Dashboard shows real stats: XP earned, level, skills, day streak, and weekly activity. Everything updates as you complete tasks.',
    color: 'from-orange-500 to-amber-500',
    tip: 'XP System: 15/task, 100/week, 500/project'
  },
  {
    icon: Award,
    title: 'Unlock Achievements & Certificates',
    description: 'Earn achievements for milestones (first project, 7-day streak, etc.). Complete a project to get a shareable certificate!',
    color: 'from-yellow-500 to-orange-500',
    tip: '9 achievements available to unlock'
  },
  {
    icon: Users,
    title: 'Join the Community',
    description: 'Publish your projects to the Community board, find collaborators, and see what others are building.',
    color: 'from-pink-500 to-rose-500',
    tip: 'Share your progress on LinkedIn too!'
  },
  {
    icon: MessageCircle,
    title: 'AI Assistant at Your Service',
    description: 'Got questions? Click the chat bubble in the bottom-right corner. Our AI assistant can help with projects, concepts, and code.',
    color: 'from-purple-500 to-indigo-500',
    tip: 'Powered by Google Gemini AI'
  }
];

const OnboardingTour = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenTour) {
      // Show tour after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setIsVisible(false);
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isVisible) return null;

  const step = tourSteps[currentStep];
  const StepIcon = step.icon;
  const isLast = currentStep === tourSteps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key={currentStep}
          className="w-full max-w-lg card-glass rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          {/* Progress dots */}
          <div className="px-6 pt-5 flex items-center justify-between">
            <div className="flex gap-1.5">
              {tourSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentStep ? 'w-8 bg-gradient-to-r ' + step.color
                    : i < currentStep ? 'w-4 bg-neon-purple-500/50'
                    : 'w-4 bg-deep-blue-700'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleSkip}
              className="text-xs text-deep-blue-500 hover:text-white transition-colors"
            >
              Skip tour
            </button>
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            <motion.div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              <StepIcon className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h2
              className="text-2xl font-bold text-white mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {step.title}
            </motion.h2>

            <motion.p
              className="text-deep-blue-300 mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {step.description}
            </motion.p>

            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-deep-blue-800/50 border border-deep-blue-700/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-3 h-3 text-neon-purple-400" />
              <span className="text-xs text-deep-blue-300">{step.tip}</span>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-deep-blue-400 hover:text-white hover:bg-deep-blue-800/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <span className="text-xs text-deep-blue-600">
              {currentStep + 1} / {tourSteps.length}
            </span>

            <motion.button
              onClick={handleNext}
              className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r ${step.color} hover:shadow-lg transition-all`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isLast ? "Let's Go!" : 'Next'}
              {!isLast && <ChevronRight className="w-4 h-4" />}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingTour;
