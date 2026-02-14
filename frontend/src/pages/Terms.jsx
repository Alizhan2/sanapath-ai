import { motion } from 'framer-motion';
import { FileText, CheckCircle2, AlertCircle, Scale, Users, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const sections = [
  {
    icon: CheckCircle2, title: 'Acceptance of Terms',
    content: `By accessing or using SanaPath AI ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.

SanaPath AI is provided by the AI-Sana ecosystem and is designed to help students discover personalized career paths in AI and technology fields.`
  },
  {
    icon: Users, title: 'User Accounts',
    content: `• You must be at least 16 years old to create an account
• You are responsible for maintaining the security of your account
• You may sign in using GitHub or Google OAuth — we do not store passwords
• One account per person; shared accounts are not permitted
• You agree to provide accurate information in surveys and profile settings
• We reserve the right to suspend accounts that violate these terms`
  },
  {
    icon: FileText, title: 'Acceptable Use',
    content: `When using SanaPath AI, you agree to:
• Use the platform for educational and career development purposes
• Not submit false or misleading survey responses
• Not attempt to manipulate the leaderboard or achievement system
• Not use automated tools to interact with the platform without permission
• Not share content that is offensive, harmful, or violates others' rights
• Respect other community members in all interactions

Projects and content you create remain yours. By publishing to the Community board, you grant SanaPath AI a non-exclusive license to display it on the platform.`
  },
  {
    icon: Scale, title: 'AI Recommendations Disclaimer',
    content: `SanaPath AI provides AI-generated career recommendations and project suggestions. Please note:
• Recommendations are based on algorithms and may not always be perfect
• AI-generated content should be used as guidance, not definitive advice
• Career outcomes depend on many factors beyond our platform
• We do not guarantee employment or specific career results
• The AI assistant provides general advice and is not a substitute for professional career counseling

We continuously improve our algorithms based on user feedback and outcomes.`
  },
  {
    icon: Shield, title: 'Intellectual Property',
    content: `• The SanaPath AI platform, design, and codebase are property of the AI-Sana ecosystem
• AI-generated recommendations and roadmaps are provided for your personal use
• Certificates earned through the platform are for educational purposes
• You may share certificates on LinkedIn and other professional platforms
• Community-published projects must be your own original work or properly attributed`
  },
  {
    icon: AlertCircle, title: 'Limitation of Liability',
    content: `SanaPath AI is provided "as is" without warranties of any kind. We are not liable for:
• Loss of data or service interruptions
• Accuracy of AI-generated recommendations
• Decisions made based on platform suggestions
• Third-party services (GitHub, Google, Render) availability

We strive to provide a reliable and helpful service, but cannot guarantee uninterrupted access or perfect accuracy.

These terms were last updated on February 15, 2026. We may update these terms periodically. Continued use of the platform constitutes acceptance of any changes.

Contact: hello@sanapath.ai`
  },
];

const Terms = () => (
  <div className="min-h-screen bg-hero-pattern">
    <Navbar />
    <div className="pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <FileText className="w-12 h-12 text-cyber-blue mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-deep-blue-300">Rules and guidelines for using SanaPath AI</p>
          <p className="text-xs text-deep-blue-500 mt-2">Last updated: February 15, 2026</p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card-glass p-6">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <s.icon className="w-5 h-5 text-cyber-blue" /> {s.title}
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

export default Terms;
