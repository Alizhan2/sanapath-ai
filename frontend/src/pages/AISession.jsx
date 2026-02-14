import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useRealStats } from '../hooks/useRealStats';
import DashboardLayout from '../components/DashboardLayout';
import {
  Send, Bot, User, Sparkles, Loader2, ThumbsUp, ThumbsDown,
  Copy, Check, Lightbulb, Code, BookOpen, Rocket, Map, Target,
  Star, Flame, Wifi, WifiOff
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://sanapath-ai.onrender.com';

const quickActions = [
  { icon: Map, text: 'Explain my next step', color: 'text-neon-purple-400 bg-neon-purple-500/10' },
  { icon: Lightbulb, text: 'Suggest a mini-project', color: 'text-yellow-400 bg-yellow-500/10' },
  { icon: Code, text: 'Review my README', color: 'text-cyber-blue bg-cyber-blue/10' },
  { icon: Target, text: 'Improve my LinkedIn headline', color: 'text-[#0077B5] bg-[#0077B5]/10' },
];

const AISession = () => {
  const { user } = useAuth();
  const { stats, skills } = useRealStats();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Greeting
    setTimeout(() => {
      setMessages([{
        id: Date.now(),
        role: 'assistant',
        content: `Hey ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your SanaPath AI coach.\n\nI can see you're on the **Junior Backend Developer** path. How can I help you today? Use the quick actions below or ask me anything!`,
        timestamp: new Date()
      }]);
    }, 400);
  }, []);

  const callAI = async (msg) => {
    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, context: `User: ${user?.name}, Level: ${stats.level}, Skills: ${skills.map(s => s.name).join(', ')}` })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setIsOnline(true);
      return data.reply;
    } catch {
      setIsOnline(false);
      return "I'm having trouble connecting. Try again in a moment!";
    }
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: text, timestamp: new Date() }]);
    setInput('');
    setIsTyping(true);
    const reply = await callAI(text);
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply, timestamp: new Date() }]);
    setIsTyping(false);
  };

  return (
    <DashboardLayout>
      <div className="flex gap-6 h-[calc(100vh-5rem)]">
        {/* Left — Profile Summary */}
        <div className="hidden lg:flex flex-col w-72 flex-shrink-0 space-y-4">
          <div className="card-glass p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center overflow-hidden">
                {user?.avatar_url ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-white" />}
              </div>
              <div>
                <p className="text-white font-semibold">{user?.name || 'Student'}</p>
                <p className="text-xs text-deep-blue-400">Junior Backend Developer</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-deep-blue-400">Target</span><span className="text-white">Backend Dev</span></div>
              <div className="flex justify-between"><span className="text-deep-blue-400">Level</span><span className="text-neon-purple-400 flex items-center gap-1"><Star className="w-3 h-3" /> {stats.level}</span></div>
              <div className="flex justify-between"><span className="text-deep-blue-400">Streak</span><span className="text-orange-400 flex items-center gap-1"><Flame className="w-3 h-3" /> {stats.streak}w</span></div>
              <div className="flex justify-between"><span className="text-deep-blue-400">XP</span><span className="text-cyber-blue">{stats.xp}</span></div>
            </div>
          </div>

          <div className="card-glass p-5">
            <h4 className="text-xs font-medium text-deep-blue-400 uppercase tracking-wider mb-3">Key Skills</h4>
            <div className="space-y-2">
              {(skills.length > 0 ? skills.slice(0, 5) : [{ name: 'Python', level: 60 }, { name: 'FastAPI', level: 40 }]).map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1"><span className="text-deep-blue-300">{s.name}</span><span className="text-deep-blue-500">{s.level}%</span></div>
                  <div className="h-1.5 bg-deep-blue-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue rounded-full" style={{ width: `${s.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-glass p-5">
            <h4 className="text-xs font-medium text-deep-blue-400 uppercase tracking-wider mb-3">Mini Roadmap</h4>
            <div className="space-y-2">
              {['Python Basics', 'APIs & Databases', 'Testing', 'Deploy & Portfolio'].map((s, i) => (
                <div key={i} className={`flex items-center gap-2 text-sm ${i === 1 ? 'text-neon-purple-400' : i < 1 ? 'text-deep-blue-500 line-through' : 'text-deep-blue-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-neon-purple-400' : i < 1 ? 'bg-green-500' : 'bg-deep-blue-700'}`} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Chat */}
        <div className="flex-1 flex flex-col card-glass rounded-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-deep-blue-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold flex items-center gap-2">AI Session with SanaPath <Sparkles className="w-4 h-4 text-yellow-400" /></h2>
                <p className="text-xs text-deep-blue-400 flex items-center gap-1">
                  {isOnline ? <><Wifi className="w-3 h-3 text-green-400" /> Powered by Gemini</> : <><WifiOff className="w-3 h-3 text-yellow-400" /> Offline mode</>}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-cyber-blue/20' : 'bg-gradient-to-r from-neon-purple-500 to-cyber-blue'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-cyber-blue" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`flex-1 max-w-[75%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-cyber-blue/20 text-white rounded-br-sm'
                      : 'bg-deep-blue-800/60 text-deep-blue-100 rounded-bl-sm'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-1.5 ml-1">
                      <button onClick={() => { navigator.clipboard.writeText(msg.content); setCopiedId(msg.id); setTimeout(() => setCopiedId(null), 2000); }} className="p-1 rounded hover:bg-deep-blue-700 text-deep-blue-500 hover:text-white transition-colors">
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <button className="p-1 rounded hover:bg-deep-blue-700 text-deep-blue-500 hover:text-green-400 transition-colors"><ThumbsUp className="w-3 h-3" /></button>
                      <button className="p-1 rounded hover:bg-deep-blue-700 text-deep-blue-500 hover:text-red-400 transition-colors"><ThumbsDown className="w-3 h-3" /></button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div>
                <div className="bg-deep-blue-800/60 p-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1"><span className="w-2 h-2 bg-deep-blue-400 rounded-full animate-bounce" /><span className="w-2 h-2 bg-deep-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><span className="w-2 h-2 bg-deep-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-6 pb-3">
              <div className="flex flex-wrap gap-2">
                {quickActions.map((a, i) => (
                  <button key={i} onClick={() => handleSend(a.text)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-deep-blue-700/50 hover:border-neon-purple-500/50 transition-all ${a.color}`}>
                    <a.icon className="w-4 h-4" />
                    {a.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-deep-blue-700/50">
            <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-3">
              <input
                type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything about your career path..."
                className="flex-1 px-5 py-3 rounded-xl bg-deep-blue-900/50 border border-deep-blue-700 text-white placeholder-deep-blue-500 focus:outline-none focus:border-neon-purple-500 transition-colors"
              />
              <motion.button
                type="submit" disabled={!input.trim() || isTyping}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-neon-purple-500 to-cyber-blue text-white disabled:opacity-50"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AISession;
