import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import {
  ChevronRight, ChevronLeft, Clock, Brain, Target,
  Star, Send, Sparkles, CheckCircle2, PartyPopper
} from 'lucide-react';

const steps = [
  {
    id: 1, title: 'Time Invested',
    question: 'How many hours did you study/code this week?',
    type: 'slider', min: 0, max: 40, unit: 'hours',
  },
  {
    id: 2, title: 'Hardest Topic',
    question: 'What was the hardest topic you worked on?',
    type: 'choice',
    options: ['Algorithms', 'Backend (APIs)', 'Databases', 'DevOps/Docker', 'ML/AI', 'Frontend', 'System Design', 'Nothing was hard 😎'],
  },
  {
    id: 3, title: 'Confidence Level',
    question: 'How confident do you feel about this week\'s progress?',
    type: 'rating', max: 5,
  },
  {
    id: 4, title: 'Achievements',
    question: 'What did you accomplish this week?',
    type: 'multi-choice',
    options: ['Completed a task', 'Pushed code to GitHub', 'Learned something new', 'Updated LinkedIn', 'Built/fixed a project', 'Read documentation', 'Solved LeetCode problems', 'Nothing yet'],
  },
  {
    id: 5, title: 'Notes & Reflection',
    question: 'Any notes or thoughts about this week?',
    type: 'text',
  },
];

const motivationalMessages = [
  "🚀 Great week! Keep building that momentum!",
  "🔥 Consistency beats intensity. You're doing amazing!",
  "💪 Every hour invested brings you closer to your dream role!",
  "⭐ The fact that you're checking in shows real commitment!",
  "🌟 Progress isn't always visible, but it's always happening!",
];

const WeeklyCheckin = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const setAnswer = (val) => setAnswers(prev => ({ ...prev, [step.id]: val }));

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    const msg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card-glass p-10 text-center max-w-lg"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
              <PartyPopper className="w-16 h-16 text-neon-purple-400 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-3">Check-in Complete! 🎉</h2>
            <p className="text-deep-blue-300 mb-6 text-lg">{msg}</p>

            <div className="card-glass p-4 mb-6 text-left space-y-2">
              <h3 className="text-sm font-semibold text-deep-blue-400 uppercase tracking-wider mb-3">Your Summary</h3>
              <div className="flex justify-between text-sm">
                <span className="text-deep-blue-400">Hours studied</span>
                <span className="text-white font-medium">{answers[1] || 0} hrs</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-deep-blue-400">Hardest topic</span>
                <span className="text-white font-medium">{answers[2] || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-deep-blue-400">Confidence</span>
                <span className="text-white font-medium">{'⭐'.repeat(answers[3] || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-deep-blue-400">Achievements</span>
                <span className="text-white font-medium">{(answers[4] || []).length} items</span>
              </div>
            </div>

            <button onClick={() => { setSubmitted(false); setCurrentStep(0); setAnswers({}); }}
              className="btn-secondary w-full !py-2.5"
            >
              Done
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Weekly Check-in</h1>
          <p className="text-deep-blue-400 text-sm">Reflect on your week and track your growth</p>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-deep-blue-400">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-xs text-deep-blue-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-deep-blue-800 overflow-hidden">
            <motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue" />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="card-glass p-8 mb-6"
          >
            <p className="text-xs text-neon-purple-400 uppercase tracking-wider font-medium mb-2">{step.title}</p>
            <h2 className="text-xl font-semibold text-white mb-8">{step.question}</h2>

            {/* Slider */}
            {step.type === 'slider' && (
              <div className="space-y-6">
                <input
                  type="range" min={step.min} max={step.max} value={answers[step.id] || 0}
                  onChange={e => setAnswer(Number(e.target.value))}
                  className="w-full h-2 bg-deep-blue-800 rounded-full appearance-none cursor-pointer accent-neon-purple-500"
                />
                <div className="text-center">
                  <span className="text-4xl font-bold gradient-text">{answers[step.id] || 0}</span>
                  <span className="text-deep-blue-400 ml-2">{step.unit}</span>
                </div>
              </div>
            )}

            {/* Single Choice */}
            {step.type === 'choice' && (
              <div className="grid grid-cols-2 gap-2">
                {step.options.map(opt => (
                  <button key={opt} onClick={() => setAnswer(opt)}
                    className={`p-3 rounded-xl text-sm font-medium text-left transition-all border ${
                      answers[step.id] === opt
                        ? 'bg-neon-purple-500/20 text-neon-purple-400 border-neon-purple-500/40'
                        : 'text-deep-blue-300 border-deep-blue-700 hover:border-deep-blue-500'
                    }`}
                  >{opt}</button>
                ))}
              </div>
            )}

            {/* Rating */}
            {step.type === 'rating' && (
              <div className="flex items-center justify-center gap-3">
                {Array.from({ length: step.max }, (_, i) => (
                  <button key={i} onClick={() => setAnswer(i + 1)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star className={`w-10 h-10 ${(answers[step.id] || 0) > i ? 'text-yellow-400 fill-yellow-400' : 'text-deep-blue-600'}`} />
                  </button>
                ))}
              </div>
            )}

            {/* Multi Choice */}
            {step.type === 'multi-choice' && (
              <div className="grid grid-cols-2 gap-2">
                {step.options.map(opt => {
                  const selected = (answers[step.id] || []).includes(opt);
                  return (
                    <button key={opt} onClick={() => {
                      const current = answers[step.id] || [];
                      setAnswer(selected ? current.filter(x => x !== opt) : [...current, opt]);
                    }}
                      className={`p-3 rounded-xl text-sm font-medium text-left transition-all border flex items-center gap-2 ${
                        selected
                          ? 'bg-neon-purple-500/20 text-neon-purple-400 border-neon-purple-500/40'
                          : 'text-deep-blue-300 border-deep-blue-700 hover:border-deep-blue-500'
                      }`}
                    >
                      {selected ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <div className="w-4 h-4 rounded-full border border-deep-blue-600 flex-shrink-0" />}
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Text */}
            {step.type === 'text' && (
              <textarea
                value={answers[step.id] || ''} onChange={e => setAnswer(e.target.value)}
                placeholder="Share your thoughts, wins, or challenges..."
                className="w-full px-4 py-3 rounded-xl bg-deep-blue-900/50 border border-deep-blue-700 text-white placeholder-deep-blue-600 text-sm resize-none focus:outline-none focus:border-neon-purple-500 h-32"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-deep-blue-300 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {currentStep < steps.length - 1 ? (
            <button onClick={() => setCurrentStep(prev => prev + 1)}
              className="btn-primary !py-2.5 flex items-center gap-2"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit}
              className="btn-primary !py-2.5 flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Check-in
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WeeklyCheckin;
