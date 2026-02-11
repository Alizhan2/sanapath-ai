import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BrainCircuit, Target, Users, Rocket, Globe, Award,
  Heart, Code2, BookOpen, TrendingUp, ArrowRight, Sparkles,
  GraduationCap, Building, Lightbulb, Zap
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const stats = [
  { label: 'Students', value: '60,000+', icon: Users, color: 'text-neon-purple-400' },
  { label: 'AI Projects', value: '5,000+', icon: Rocket, color: 'text-cyber-blue' },
  { label: 'Partners', value: '150+', icon: Building, color: 'text-green-400' },
  { label: 'Countries', value: '45+', icon: Globe, color: 'text-orange-400' },
];

const team = [
  { name: 'AI-Sana Foundation', role: 'Ecosystem Creator', icon: BrainCircuit, color: 'from-neon-purple-500 to-cyber-blue' },
  { name: 'SanaPath AI Team', role: 'Platform Development', icon: Code2, color: 'from-blue-500 to-cyan-500' },
  { name: 'Community Leaders', role: 'Student Mentors', icon: Users, color: 'from-green-500 to-emerald-500' },
  { name: 'Industry Partners', role: 'Career Guidance', icon: Building, color: 'from-orange-500 to-amber-500' },
];

const values = [
  { icon: Target, title: 'Personalized Learning', desc: 'AI-driven recommendations tailored to each student\'s unique skills, interests, and career goals.' },
  { icon: Lightbulb, title: 'Learn by Building', desc: 'Real-world projects with step-by-step roadmaps, not just theory. Build a portfolio that matters.' },
  { icon: Users, title: 'Community First', desc: 'Connect with 60,000+ students, find collaborators, and grow together in the AI-Sana ecosystem.' },
  { icon: TrendingUp, title: 'Career Impact', desc: '95% of our students report significant career advancement after completing SanaPath projects.' },
];

const timeline = [
  { year: '2024', title: 'AI-Sana Ecosystem Founded', desc: 'Started with a vision to democratize AI education across Central Asia.' },
  { year: '2024', title: 'SanaPath AI Launched', desc: 'AI-powered project matching platform goes live with 1,000 early adopters.' },
  { year: '2025', title: '60K Students Milestone', desc: 'Community grows to 60,000+ students across 45 countries.' },
  { year: '2026', title: 'Full Platform Launch', desc: 'Certificates, leaderboard, advanced AI assistant, and 150+ industry partners.' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-hero-pattern">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple-500/10 border border-neon-purple-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-neon-purple-400" />
              <span className="text-sm text-neon-purple-400">Part of the AI-Sana Ecosystem</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Empowering the Next Generation of{' '}
              <span className="gradient-text">AI Innovators</span>
            </h1>
            <p className="text-lg text-deep-blue-300 max-w-2xl mx-auto mb-8">
              SanaPath AI is an intelligent platform that matches students with personalized AI projects, 
              providing structured roadmaps, mentorship, and career acceleration through the AI-Sana ecosystem.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="card-glass p-5 text-center group hover:border-neon-purple-500/30 transition-all">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-deep-blue-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="card-glass p-8 md:p-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                  <Heart className="w-8 h-8 text-cyber-pink" />
                  Our Mission
                </h2>
                <p className="text-deep-blue-300 leading-relaxed mb-4">
                  We believe every student deserves access to high-quality, personalized AI education. 
                  SanaPath AI bridges the gap between learning and doing by matching students with real-world 
                  projects that align with their skills and career aspirations.
                </p>
                <p className="text-deep-blue-300 leading-relaxed">
                  As part of the AI-Sana ecosystem, we're building the largest AI learning community 
                  in Central Asia and beyond — connecting 60,000+ students with industry partners 
                  and cutting-edge opportunities.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {values.map((v, i) => (
                  <motion.div
                    key={i}
                    className="p-4 rounded-xl bg-deep-blue-800/30 border border-deep-blue-700/30"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <v.icon className="w-6 h-6 text-neon-purple-400 mb-2" />
                    <h4 className="text-white font-semibold text-sm mb-1">{v.title}</h4>
                    <p className="text-xs text-deep-blue-400">{v.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12 flex items-center justify-center gap-3">
            <TrendingUp className="w-8 h-8 text-cyber-blue" />
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-purple-500 to-cyber-blue" />
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                className="relative pl-16 pb-10 last:pb-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="absolute left-3 top-1 w-7 h-7 rounded-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white" />
                </div>
                <div className="card-glass p-5">
                  <span className="text-xs text-neon-purple-400 font-semibold">{item.year}</span>
                  <h3 className="text-white font-bold mt-1">{item.title}</h3>
                  <p className="text-deep-blue-400 text-sm mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12 flex items-center justify-center gap-3">
            <Users className="w-8 h-8 text-neon-purple-400" />
            Behind SanaPath
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {team.map((member, i) => (
              <motion.div
                key={i}
                className="card-glass p-6 text-center group hover:border-neon-purple-500/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <member.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-bold text-sm">{member.name}</h4>
                <p className="text-deep-blue-400 text-xs mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            className="card-glass p-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GraduationCap className="w-12 h-12 text-neon-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your AI Journey?</h2>
            <p className="text-deep-blue-300 mb-6">
              Join 60,000+ students building the future with AI. Take the survey and get your personalized roadmap.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/survey">
                <motion.button
                  className="btn-primary flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="w-5 h-5" />
                  Get Started Free
                </motion.button>
              </Link>
              <Link to="/community">
                <motion.button
                  className="px-6 py-3 rounded-xl border border-deep-blue-600 text-white hover:bg-deep-blue-800/50 transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Community
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
