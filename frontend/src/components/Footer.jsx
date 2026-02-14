import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Github, Twitter, Linkedin, Heart, Send, ArrowRight, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmailError('');
    if (!email) { setEmailError('Please enter your email'); return; }
    if (!validateEmail(email)) { setEmailError('Please enter a valid email'); return; }
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 4000);
    setEmail('');
  };

  const footerLinks = {
    Product: [
      { name: 'Features', href: '/#features' },
      { name: 'Survey', href: '/survey' },
      { name: 'Community', href: '/community' },
      { name: 'Leaderboard', href: '/leaderboard' },
    ],
    Resources: [
      { name: 'Documentation', href: '/about' },
      { name: 'AI Assistant', href: '/dashboard' },
      { name: 'Blog', href: '/community' },
      { name: 'Support', href: '/contact' },
    ],
    Company: [
      { name: 'About AI-Sana', href: '/about' },
      { name: 'Careers', href: '/about' },
      { name: 'Partners', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/privacy' },
    ],
  };

  return (
    <footer className="relative border-t border-deep-blue-800/50 bg-deep-blue-950/80 backdrop-blur-xl">
      {/* Newsletter Section */}
      <div className="border-b border-deep-blue-800/50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Stay Updated with AI Trends
              </h3>
              <p className="text-deep-blue-300">
                Get weekly insights, project ideas, and community highlights delivered to your inbox.
              </p>
            </div>
            <div>
              <form onSubmit={handleSubscribe} className="flex gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-blue-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-deep-blue-900/50 border border-deep-blue-700 text-white placeholder-deep-blue-500 focus:outline-none focus:border-neon-purple-500 transition-colors"
                  />
                </div>
                <motion.button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-purple-500 to-cyber-blue text-white font-medium hover:shadow-lg hover:shadow-neon-purple-500/25 transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {subscribed ? (
                    <>
                      <span>Subscribed!</span>
                      <Heart className="w-5 h-5 text-pink-400" />
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>              {emailError && <p className="text-xs text-red-400 mt-2">{emailError}</p>}              <p className="text-xs text-deep-blue-500 mt-2">
                No spam, unsubscribe anytime. Read our <Link to="/privacy" className="text-neon-purple-400 hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-neon-purple-500 to-cyber-blue">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-white">Sana</span>
                <span className="gradient-text">Path</span>
              </span>
            </Link>
            <p className="text-deep-blue-400 text-sm mb-4">
              Empowering 60,000+ students to discover their perfect AI career path. Part of the AI-Sana ecosystem.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <a href="mailto:hello@sanapath.ai" className="flex items-center gap-2 text-sm text-deep-blue-400 hover:text-neon-purple-400 transition-colors">
                <Mail className="w-4 h-4" />
                hello@sanapath.ai
              </a>
              <p className="flex items-center gap-2 text-sm text-deep-blue-400">
                <MapPin className="w-4 h-4" />
                San Francisco, CA
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="https://github.com/Alizhan2" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-deep-blue-800/50 text-deep-blue-400 hover:text-white hover:bg-deep-blue-700 transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/sanapath_ai" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-deep-blue-800/50 text-deep-blue-400 hover:text-white hover:bg-deep-blue-700 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/sanapath-ai" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-deep-blue-800/50 text-deep-blue-400 hover:text-white hover:bg-deep-blue-700 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-deep-blue-400 hover:text-neon-purple-400 transition-colors text-sm flex items-center gap-1 group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-deep-blue-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-deep-blue-400 text-sm">
              © 2026 SanaPath AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://github.com/Alizhan2/sanapath-ai" target="_blank" rel="noopener noreferrer" className="text-deep-blue-400 hover:text-white text-sm transition-colors">
                Status
              </a>
              <a href="https://github.com/Alizhan2/sanapath-ai/commits/main" target="_blank" rel="noopener noreferrer" className="text-deep-blue-400 hover:text-white text-sm transition-colors">
                Changelog
              </a>
              <p className="text-deep-blue-400 text-sm flex items-center gap-1">
                Made with <Heart className="w-4 h-4 text-cyber-pink animate-pulse" /> for the AI-Sana community
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
