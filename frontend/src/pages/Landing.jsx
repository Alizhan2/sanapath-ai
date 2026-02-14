import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Github,
  Linkedin,
  Sparkles,
  Target,
  Zap,
  Rocket,
  Map,
  TrendingUp,
  CheckCircle2,
  Star,
  BrainCircuit,
  Calendar,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-96 h-96 bg-neon-purple-600 -top-48 -left-48" />
        <div className="floating-orb w-[600px] h-[600px] bg-cyber-blue -bottom-96 -right-48" style={{ animationDelay: '2s' }} />
        <div className="floating-orb w-64 h-64 bg-cyber-pink top-1/2 left-1/3" style={{ animationDelay: '4s' }} />
      </div>

      <Navbar />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-screen flex items-center px-4 pt-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Copy */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-deep-blue-800/50 border border-neon-purple-500/30 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles className="w-4 h-4 text-neon-purple-400" />
                <span className="text-sm text-neon-purple-300">AI-Sana Ecosystem</span>
                <span className="px-2 py-0.5 bg-neon-purple-500/20 rounded-full text-xs text-cyber-blue">60K+ Students</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-white">Your AI mentor</span>
                <br />
                <span className="text-white">for </span>
                <span className="gradient-text animate-gradient-x bg-[length:200%_auto]">IT & AI careers</span>
              </h1>

              <p className="text-xl text-deep-blue-200 max-w-xl mb-8 leading-relaxed">
                SanaPath analyzes your <span className="text-white font-medium">GitHub</span> and{' '}
                <span className="text-white font-medium">LinkedIn</span> profiles and builds a personal
                skill roadmap with tasks, projects, and weekly check‑ins.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <motion.button
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#24292e] text-white font-semibold hover:bg-[#2f363d] transition-all hover:shadow-lg hover:shadow-[#24292e]/30"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Github className="w-5 h-5" />
                    Sign in with GitHub
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#0077B5] text-white font-semibold hover:bg-[#006097] transition-all hover:shadow-lg hover:shadow-[#0077B5]/30"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Linkedin className="w-5 h-5" />
                    Sign in with LinkedIn
                  </motion.button>
                </Link>
              </div>

              <p className="text-sm text-deep-blue-500 mt-4">Free forever · No credit card required</p>
            </motion.div>

            {/* Right — Glassmorphism Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-neon-purple-500/20 via-cyber-blue/20 to-neon-purple-500/20 blur-3xl rounded-3xl" />

              <div className="relative card-glass p-6 rounded-2xl">
                {/* Mini top bar */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center">
                      <BrainCircuit className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Hi, Alizhan 👋</p>
                      <p className="text-deep-blue-400 text-xs">Junior Backend Developer</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs flex items-center gap-1">
                    <Star className="w-3 h-3" /> 1,250 XP
                  </span>
                </div>

                {/* Roadmap Progress */}
                <div className="p-4 rounded-xl bg-deep-blue-800/60 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-deep-blue-300">Roadmap Progress</span>
                    <span className="text-lg font-bold text-white">45%</span>
                  </div>
                  <div className="h-2.5 bg-deep-blue-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '45%' }}
                      transition={{ duration: 1.5, delay: 1 }}
                    />
                  </div>
                </div>

                {/* Mini Task List */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-deep-blue-400 font-medium uppercase tracking-wider">This week's focus</p>
                  {[
                    { text: 'Build CRUD API with FastAPI', done: true, tag: 'Backend' },
                    { text: 'Write unit tests', done: false, tag: 'Testing' },
                    { text: 'Improve README for portfolio', done: false, tag: 'GitHub' },
                  ].map((task, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-deep-blue-800/40"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 + i * 0.15 }}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                        task.done ? 'bg-green-500 border-green-500' : 'border-deep-blue-600'
                      }`}>
                        {task.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className={`text-sm flex-1 ${task.done ? 'text-deep-blue-500 line-through' : 'text-white'}`}>
                        {task.text}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-deep-blue-700/80 text-deep-blue-300 text-xs">{task.tag}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'GitHub Health', value: '72%', color: 'text-green-400' },
                    { label: 'LinkedIn Score', value: '58%', color: 'text-[#0077B5]' },
                    { label: 'Streak', value: '12 days', color: 'text-orange-400' },
                  ].map((s, i) => (
                    <div key={i} className="p-3 rounded-lg bg-deep-blue-800/40 text-center">
                      <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-deep-blue-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It <span className="gradient-text">Works</span></h2>
            <p className="text-xl text-deep-blue-300">Three steps to your personal career roadmap</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Github, title: 'Connect Profiles', desc: 'Link your GitHub and LinkedIn. We analyze your repos, skills, experience, and career interests.' },
              { step: '02', icon: BrainCircuit, title: 'AI Analysis', desc: 'Our AI evaluates your current level, identifies gaps, and creates a personalized growth plan.' },
              { step: '03', icon: Map, title: 'Personal Roadmap & Tasks', desc: 'Get a step-by-step roadmap with weekly tasks, mini-projects, and progress tracking.' }
            ].map((item, i) => (
              <motion.div key={i} className="relative" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="card-glass p-8 text-center relative overflow-hidden group h-full">
                  <div className="absolute top-4 left-4 text-6xl font-bold text-deep-blue-700/50 group-hover:text-neon-purple-500/20 transition-colors">{item.step}</div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                    <p className="text-deep-blue-300">{item.desc}</p>
                  </div>
                </div>
                {i < 2 && <div className="hidden md:block absolute top-1/2 -right-4 text-neon-purple-500 z-10"><ArrowRight className="w-8 h-8" /></div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ BENEFITS ═══════════════════ */}
      <section id="features" className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why <span className="gradient-text">SanaPath</span>?</h2>
            <p className="text-xl text-deep-blue-300">Everything you need to accelerate your career</p>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              { icon: Map, title: 'Clear Roadmap', desc: 'A step-by-step plan tailored to your skills and goals — no more guessing what to learn next.', color: 'from-neon-purple-500 to-neon-purple-600' },
              { icon: Briefcase, title: 'Portfolio-Ready Projects', desc: 'Build real projects that impress recruiters. Each one optimized for your target role.', color: 'from-cyber-blue to-blue-500' },
              { icon: TrendingUp, title: 'Better GitHub & LinkedIn', desc: 'Get actionable tips to improve your profiles and increase visibility to hiring managers.', color: 'from-green-500 to-emerald-500' },
              { icon: Calendar, title: 'Motivation & Check-ins', desc: 'Weekly surveys, streak tracking, and AI feedback keep you accountable and on track.', color: 'from-orange-500 to-amber-500' }
            ].map((b, i) => (
              <motion.div key={i} className="card-glass p-6 group hover:border-neon-purple-500/50 transition-all" variants={itemVariants} whileHover={{ y: -6 }}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <b.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{b.title}</h3>
                <p className="text-sm text-deep-blue-300 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              { value: '60,000+', label: 'Active Students' },
              { value: '5,000+', label: 'Projects Launched' },
              { value: '150+', label: 'Partner Companies' },
              { value: '95%', label: 'Success Rate' }
            ].map((stat, i) => (
              <motion.div key={i} className="text-center" variants={itemVariants}>
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-deep-blue-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div className="card-glass p-12 text-center relative overflow-hidden" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple-500/10 via-transparent to-cyber-blue/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your <span className="gradient-text">Career Path</span>?</h2>
              <p className="text-xl text-deep-blue-300 mb-8 max-w-2xl mx-auto">Join 60,000+ students who are already growing with SanaPath AI.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/login">
                  <motion.button className="btn-primary flex items-center gap-2 text-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Get Started Free <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link to="/survey">
                  <motion.button className="btn-secondary flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Try the Survey <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
