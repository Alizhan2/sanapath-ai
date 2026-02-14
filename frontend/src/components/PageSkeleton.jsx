import { motion } from 'framer-motion';

const shimmer = {
  hidden: { x: '-100%' },
  visible: { x: '100%', transition: { repeat: Infinity, duration: 1.5, ease: 'linear' } },
};

const Pulse = ({ className }) => (
  <div className={`relative overflow-hidden rounded-xl bg-deep-blue-800/60 ${className}`}>
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-deep-blue-700/40 to-transparent"
      variants={shimmer}
      initial="hidden"
      animate="visible"
    />
  </div>
);

/** Full-page skeleton shown while lazy-loaded pages are downloading */
const PageSkeleton = () => (
  <div className="min-h-screen bg-hero-pattern flex items-center justify-center p-6">
    <div className="w-full max-w-5xl space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <Pulse className="w-14 h-14 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <Pulse className="h-6 w-48" />
          <Pulse className="h-4 w-32" />
        </div>
      </div>

      {/* Row of cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="card-glass p-6 space-y-4">
            <Pulse className="h-4 w-28" />
            <Pulse className="h-20 w-full" />
            <Pulse className="h-3 w-36" />
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card-glass p-5 space-y-3">
            <Pulse className="h-4 w-24" />
            <Pulse className="h-8 w-16" />
            <Pulse className="h-2 w-full" />
          </div>
        ))}
      </div>

      {/* Center spinner */}
      <div className="flex justify-center pt-4">
        <div className="w-10 h-10 border-4 border-neon-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  </div>
);

export default PageSkeleton;
