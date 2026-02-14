import { Component } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-hero-pattern flex items-center justify-center p-6">
          <motion.div
            className="card-glass max-w-md w-full p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-deep-blue-400 text-sm mb-6">
              An unexpected error occurred. Please try again or return to the dashboard.
            </p>

            {this.state.error?.message && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-left">
                <code className="text-xs text-red-300 break-all">{this.state.error.message}</code>
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <motion.button
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-purple-500 hover:bg-neon-purple-600 text-white font-medium text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </motion.button>
              <motion.a
                href="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-deep-blue-700 hover:bg-deep-blue-600 text-white font-medium text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-4 h-4" /> Dashboard
              </motion.a>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
