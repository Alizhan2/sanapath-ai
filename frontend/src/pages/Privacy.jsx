import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const sections = [
  {
    icon: Database, title: 'Information We Collect',
    content: `When you use SanaPath AI, we collect information you provide directly:
• Account information (name, email) via GitHub or Google sign-in
• Survey responses about your skills, interests, and career goals
• Projects you create or interact with on the platform
• Weekly check-in responses and progress data

We also automatically collect:
• Usage data (pages visited, features used, time spent)
• Device and browser information
• IP address and approximate location`
  },
  {
    icon: Eye, title: 'How We Use Your Data',
    content: `We use your information to:
• Generate personalized AI project recommendations and career roadmaps
• Track your learning progress and provide relevant feedback
• Improve our AI matching algorithms
• Send you weekly check-in reminders and progress updates (with your consent)
• Analyze platform usage to improve the user experience
• Display leaderboard rankings and community features

We never sell your personal data to third parties.`
  },
  {
    icon: Lock, title: 'Data Security',
    content: `We take the security of your data seriously:
• All data is transmitted using TLS/SSL encryption
• Authentication is handled through Firebase (Google infrastructure)
• Passwords are never stored directly — we use OAuth sign-in
• Database access is restricted and monitored
• We regularly review and update our security practices

While no system is 100% secure, we implement industry-standard measures to protect your information.`
  },
  {
    icon: UserCheck, title: 'Your Rights',
    content: `You have the right to:
• Access your personal data at any time through your Profile page
• Update or correct your information
• Delete your account and associated data by contacting us
• Opt out of non-essential communications
• Export your data in a portable format

To exercise any of these rights, contact us at hello@sanapath.ai.`
  },
  {
    icon: Shield, title: 'Cookies & Analytics',
    content: `SanaPath AI uses minimal cookies:
• Essential cookies for authentication and session management
• Local storage for saving your project data and preferences
• We do not use third-party advertising cookies
• Analytics data is aggregated and anonymized

You can control cookie settings through your browser preferences.`
  },
  {
    icon: Mail, title: 'Contact & Updates',
    content: `This privacy policy was last updated on February 15, 2026.

We may update this policy from time to time. Significant changes will be communicated through the platform or via email.

For questions about this policy or your data:
• Email: hello@sanapath.ai
• GitHub: github.com/Alizhan2/sanapath-ai

SanaPath AI is part of the AI-Sana ecosystem.`
  },
];

const Privacy = () => (
  <div className="min-h-screen bg-hero-pattern">
    <Navbar />
    <div className="pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Shield className="w-12 h-12 text-neon-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-deep-blue-300">How SanaPath AI handles your data</p>
          <p className="text-xs text-deep-blue-500 mt-2">Last updated: February 15, 2026</p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card-glass p-6">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <s.icon className="w-5 h-5 text-neon-purple-400" /> {s.title}
              </h2>
              <div className="text-sm text-deep-blue-300 leading-relaxed whitespace-pre-line">{s.content}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Privacy;
