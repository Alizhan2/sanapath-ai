import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, MapPin, Send, MessageCircle, Globe, Clock,
  Github, Linkedin, Twitter, CheckCircle, AlertCircle,
  HelpCircle, Bug, Lightbulb, Users
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const contactReasons = [
  { icon: HelpCircle, label: 'General Question', value: 'general' },
  { icon: Bug, label: 'Bug Report', value: 'bug' },
  { icon: Lightbulb, label: 'Feature Request', value: 'feature' },
  { icon: Users, label: 'Partnership', value: 'partnership' },
];

const faqs = [
  {
    q: 'Is SanaPath AI free to use?',
    a: 'Yes! SanaPath AI is completely free for students. Take the survey, get recommendations, and start building projects at no cost.'
  },
  {
    q: 'How does the AI matching work?',
    a: 'Our AI analyzes your programming skills, interests, career goals, and learning style to recommend 5 personalized projects with detailed 4-week roadmaps.'
  },
  {
    q: 'Can I use SanaPath AI without coding experience?',
    a: 'Absolutely! We have beginner-friendly projects with step-by-step guides and video tutorials to help you get started.'
  },
  {
    q: 'What is the AI-Sana ecosystem?',
    a: 'AI-Sana is a network of 60,000+ students, 150+ industry partners, and educational institutions focused on AI education and career development.'
  },
  {
    q: 'How do certificates work?',
    a: 'When you complete all 4 weeks of a project, you earn a downloadable certificate that you can share on LinkedIn and add to your resume.'
  },
  {
    q: 'Can I collaborate with other students?',
    a: 'Yes! Publish your project to the Community board and find collaborators. You can also join existing projects posted by other students.'
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', reason: 'general', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
    setTimeout(() => {
      setForm({ name: '', email: '', reason: 'general', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-hero-pattern">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-lg text-deep-blue-300 max-w-xl mx-auto">
              Have a question, feedback, or partnership opportunity? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Form - 3 cols */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="card-glass p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-neon-purple-400" />
                  Send a Message
                </h2>

                {submitted ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-deep-blue-400">We'll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-deep-blue-300 mb-1.5">Name</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-deep-blue-900/50 border border-deep-blue-700 text-white placeholder-deep-blue-500 focus:outline-none focus:border-neon-purple-500 transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-deep-blue-300 mb-1.5">Email</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-deep-blue-900/50 border border-deep-blue-700 text-white placeholder-deep-blue-500 focus:outline-none focus:border-neon-purple-500 transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    {/* Reason Select */}
                    <div>
                      <label className="block text-sm text-deep-blue-300 mb-1.5">Reason</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {contactReasons.map((r) => (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => setForm({ ...form, reason: r.value })}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                              form.reason === r.value
                                ? 'bg-neon-purple-500/20 text-neon-purple-400 border border-neon-purple-500/50'
                                : 'bg-deep-blue-800/50 text-deep-blue-400 border border-deep-blue-700/50 hover:border-deep-blue-600'
                            }`}
                          >
                            <r.icon className="w-3.5 h-3.5" />
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-deep-blue-300 mb-1.5">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-deep-blue-900/50 border border-deep-blue-700 text-white placeholder-deep-blue-500 focus:outline-none focus:border-neon-purple-500 transition-colors resize-none"
                        placeholder="Tell us what's on your mind..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-purple-500 to-cyber-blue text-white font-medium hover:shadow-lg hover:shadow-neon-purple-500/25 transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Sidebar - 2 cols */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Contact Info */}
              <div className="card-glass p-6">
                <h3 className="text-lg font-bold text-white mb-4">Contact Info</h3>
                <div className="space-y-4">
                  <a href="mailto:hello@sanapath.ai" className="flex items-center gap-3 text-deep-blue-300 hover:text-neon-purple-400 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-neon-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-neon-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-deep-blue-500">Email</p>
                      <p className="text-sm">hello@sanapath.ai</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 text-deep-blue-300">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-deep-blue-500">Location</p>
                      <p className="text-sm">Kazakhstan, Central Asia</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-deep-blue-300">
                    <div className="w-10 h-10 rounded-lg bg-cyber-blue/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-cyber-blue" />
                    </div>
                    <div>
                      <p className="text-xs text-deep-blue-500">Response Time</p>
                      <p className="text-sm">Within 24 hours</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-deep-blue-700/50">
                  <p className="text-xs text-deep-blue-500 mb-3">Follow us</p>
                  <div className="flex gap-3">
                    <a href="https://github.com/Alizhan2" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-deep-blue-800/50 text-deep-blue-400 hover:text-white hover:bg-deep-blue-700 transition-all">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href="https://linkedin.com/company/sanapath-ai" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-deep-blue-800/50 text-deep-blue-400 hover:text-white hover:bg-deep-blue-700 transition-all">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="https://twitter.com/sanapath_ai" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-deep-blue-800/50 text-deep-blue-400 hover:text-white hover:bg-deep-blue-700 transition-all">
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* FAQ Preview */}
              <div className="card-glass p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-cyber-blue" />
                  FAQ
                </h3>
                <div className="space-y-2">
                  {faqs.map((faq, i) => (
                    <div key={i} className="border border-deep-blue-700/30 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-white hover:bg-deep-blue-800/30 transition-colors flex items-center justify-between"
                      >
                        <span>{faq.q}</span>
                        <span className={`text-deep-blue-500 transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`}>▾</span>
                      </button>
                      {expandedFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="px-4 pb-3"
                        >
                          <p className="text-xs text-deep-blue-400 leading-relaxed">{faq.a}</p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
