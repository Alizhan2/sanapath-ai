import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Lightbulb,
  Code,
  BookOpen,
  Rocket,
  Wifi,
  WifiOff
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://sanapath-ai.onrender.com';

const quickPrompts = [
  { icon: Rocket, text: "Suggest a project", category: "projects" },
  { icon: BookOpen, text: "Learning resources", category: "learning" },
  { icon: Code, text: "Help with code", category: "help" },
  { icon: Lightbulb, text: "Explain a concept", category: "help" }
];

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send greeting when chat opens for first time
      setTimeout(() => {
        setMessages([{
          id: Date.now(),
          role: 'assistant',
          content: "Hello! 👋 I'm your SanaPath AI assistant, powered by Gemini.\n\nI can help you with:\n• 🎯 **Project Ideas** — Personalized AI project recommendations\n• 📚 **Learning Resources** — Tutorials, courses, and documentation\n• 🐛 **Code Help** — Debug errors and optimize your code\n• 🧠 **AI Concepts** — Explain ML topics in simple terms\n• 💼 **Career Advice** — Portfolio tips, interview prep\n\nWhat would you like to explore today? 🚀",
          timestamp: new Date(),
          source: 'gemini'
        }]);
      }, 500);
    }
  }, [isOpen]);

  const callAIAPI = async (userMessage) => {
    try {
      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: ''
        })
      });
      
      if (!response.ok) throw new Error('API error');
      
      const data = await response.json();
      setIsOnline(true);
      return { reply: data.reply, source: data.source || 'gemini' };
    } catch (err) {
      setIsOnline(false);
      // Fallback to basic local response
      return { 
        reply: "I'm having trouble connecting right now. Please try again in a moment, or check out our Survey for personalized project recommendations!\n\n💡 Tip: You can also visit the Community page to see what other students are building.",
        source: 'offline'
      };
    }
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Call real AI API
    const { reply, source } = await callAIAPI(text);

    const aiResponse = {
      id: Date.now() + 1,
      role: 'assistant',
      content: reply,
      timestamp: new Date(),
      source
    };
    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleQuickPrompt = (prompt) => {
    handleSend(prompt.text);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue text-white shadow-lg hover:shadow-neon-purple-500/50 transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-deep-blue-950" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] flex flex-col card-glass rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-deep-blue-700 bg-gradient-to-r from-neon-purple-500/10 to-cyber-blue/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-deep-blue-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      AI Assistant
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                    </h3>
                    <p className="text-xs text-deep-blue-400 flex items-center gap-1">
                      {isOnline ? (
                        <><Wifi className="w-3 h-3 text-green-400" /> Powered by Gemini</>
                      ) : (
                        <><WifiOff className="w-3 h-3 text-yellow-400" /> Offline mode</>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-deep-blue-700 text-deep-blue-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-cyber-blue/20' 
                      : 'bg-gradient-to-r from-neon-purple-500 to-cyber-blue'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-cyber-blue" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-cyber-blue/20 text-white rounded-br-none'
                        : 'bg-deep-blue-800/50 text-deep-blue-100 rounded-bl-none'
                    }`}>
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    </div>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-1 ml-1">
                        <button 
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="p-1 rounded hover:bg-deep-blue-700 text-deep-blue-500 hover:text-white transition-colors"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <button className="p-1 rounded hover:bg-deep-blue-700 text-deep-blue-500 hover:text-green-400 transition-colors">
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button className="p-1 rounded hover:bg-deep-blue-700 text-deep-blue-500 hover:text-red-400 transition-colors">
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-deep-blue-800/50 p-3 rounded-2xl rounded-bl-none">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-deep-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-deep-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-deep-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-deep-blue-500 mb-2">Quick prompts:</p>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-deep-blue-800/50 text-xs text-deep-blue-300 hover:text-white hover:bg-deep-blue-700 transition-colors"
                    >
                      <prompt.icon className="w-3 h-3" />
                      {prompt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-deep-blue-700">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-3 rounded-xl bg-deep-blue-900/50 border border-deep-blue-700 text-white placeholder-deep-blue-500 focus:outline-none focus:border-neon-purple-500 transition-colors text-sm"
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-3 rounded-xl bg-gradient-to-r from-neon-purple-500 to-cyber-blue text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </form>
              <p className="text-xs text-deep-blue-600 mt-2 text-center">
                Powered by Google Gemini ✨
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
