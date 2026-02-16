import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Github, Mail, Sparkles, ArrowLeft, Eye, EyeOff, UserPlus, Linkedin } from 'lucide-react';
import { useEffect, useState } from 'react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle, loginWithGithub, loginWithEmail, registerWithEmail, isAuthenticated, loading, error, clearError } = useAuth();
  
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the page they tried to visit, or dashboard
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    if (error) {
      setFormError(error);
      clearError();
    }
  }, [error, clearError]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    
    try {
      if (isRegister) {
        await registerWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      const errorMessage = err.message || 'Authentication failed';
      // Translate Firebase errors to user-friendly messages
      if (errorMessage.includes('user-not-found')) {
        setFormError('No account found with this email');
      } else if (errorMessage.includes('wrong-password')) {
        setFormError('Incorrect password');
      } else if (errorMessage.includes('email-already-in-use')) {
        setFormError('An account with this email already exists');
      } else if (errorMessage.includes('weak-password')) {
        setFormError('Password should be at least 6 characters');
      } else if (errorMessage.includes('invalid-email')) {
        setFormError('Invalid email address');
      } else {
        setFormError(errorMessage);
      }
    }
    setFormLoading(false);
  };

  const handleGoogleLogin = async () => {
    setFormError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      if (!err.message?.includes('popup-closed')) {
        setFormError('Google login failed. Please try again.');
      }
    }
  };

  const handleGithubLogin = async () => {
    setFormError('');
    try {
      await loginWithGithub();
    } catch (err) {
      if (!err.message?.includes('popup-closed')) {
        setFormError('GitHub login failed. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-pattern">
        <div className="w-12 h-12 border-4 border-neon-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-pattern px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-orb w-96 h-96 bg-neon-purple-600/30 -top-48 -left-48" />
        <div className="floating-orb w-64 h-64 bg-cyber-blue/30 bottom-20 -right-32" />
      </div>

      <motion.div
        className="card-glass p-8 md:p-12 max-w-md w-full relative z-10"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-deep-blue-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple-500 to-cyber-blue mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-deep-blue-300">
            {isRegister ? 'Join the AI-Sana ecosystem' : 'Sign in to continue your AI journey'}
          </p>
        </div>

        {/* Error message */}
        {formError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm"
          >
            {formError}
          </motion.div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <motion.button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-xl transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Continue with Google</span>
          </motion.button>

          <motion.button
            onClick={handleGithubLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#24292e] hover:bg-[#2f363d] text-white font-medium rounded-xl transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Github className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </motion.button>

          <motion.button
            onClick={() => {
              // LinkedIn OAuth - redirect to backend endpoint
              const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${import.meta.env.VITE_LINKEDIN_CLIENT_ID || 'demo'}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/linkedin/callback')}&scope=openid%20profile%20email`;
              if (import.meta.env.VITE_LINKEDIN_CLIENT_ID) {
                window.location.href = linkedinAuthUrl;
              } else {
                setFormError('LinkedIn login is coming soon! Please use Google or GitHub for now.');
              }
            }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#0077b5] hover:bg-[#006097] text-white font-medium rounded-xl transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Linkedin className="w-5 h-5" />
            <span>Continue with LinkedIn</span>
          </motion.button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-deep-blue-700" />
          <span className="text-deep-blue-500 text-sm">or with email</span>
          <div className="flex-1 h-px bg-deep-blue-700" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-deep-blue-900/50 border border-deep-blue-700 rounded-xl text-white placeholder-deep-blue-500 focus:border-neon-purple-500 focus:outline-none transition-colors"
              />
            </div>
          )}
          
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-deep-blue-900/50 border border-deep-blue-700 rounded-xl text-white placeholder-deep-blue-500 focus:border-neon-purple-500 focus:outline-none transition-colors"
            />
          </div>
          
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 pr-12 bg-deep-blue-900/50 border border-deep-blue-700 rounded-xl text-white placeholder-deep-blue-500 focus:border-neon-purple-500 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-deep-blue-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <motion.button
            type="submit"
            disabled={formLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-neon-purple-600 to-cyber-blue text-white font-medium rounded-xl transition-all disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {formLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isRegister ? (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Create Account</span>
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                <span>Sign In</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Toggle Register/Login */}
        <p className="text-center text-deep-blue-400 text-sm mt-6">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setFormError('');
            }}
            className="text-neon-purple-400 hover:underline font-medium"
          >
            {isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        {/* Stats */}
        <div className="mt-8 pt-6 border-t border-deep-blue-700/50 text-center">
          <p className="text-deep-blue-400 text-sm">
            Join <span className="text-cyber-blue font-semibold">60,000+</span> students in the AI-Sana ecosystem
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
