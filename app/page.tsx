'use client';


import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-pink-100 px-6 text-center relative overflow-hidden">
      {/* Animated Illustration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none opacity-60 z-0">
        <svg viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-pulse-slow">
          <ellipse cx="400" cy="200" rx="350" ry="120" fill="#a5b4fc" fillOpacity="0.15" />
          <ellipse cx="400" cy="250" rx="300" ry="100" fill="#f9a8d4" fillOpacity="0.12" />
          <ellipse cx="400" cy="150" rx="200" ry="60" fill="#fbbf24" fillOpacity="0.10" />
        </svg>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.span
          className="text-6xl mb-4"
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
        >
          🌈
        </motion.span>
        <motion.h1
          className="text-5xl font-extrabold mb-4 text-gray-800 drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Welcome to <span className="text-blue-600">MoodBlog</span>
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600 max-w-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          A unique blog platform where you can express your thoughts, tag posts with emotions, and discover content based on moods.<br />
          Built with <strong>Next.js</strong>, <strong>TypeScript</strong>, <strong>Prisma</strong> & <strong>PostgreSQL</strong>.
        </motion.p>
        <motion.div className="flex gap-4 mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
          <Link
            href="/signup"
            className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-8 py-3 rounded-xl text-base font-semibold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-pink-600 transition-transform duration-200"
          >
            Get Started Free
          </Link>
          <Link
            href="/signin"
            className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-xl text-base font-semibold shadow hover:bg-blue-50 transition"
          >
            Sign In
          </Link>
        </motion.div>
        <motion.span className="text-xs text-gray-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>
          No credit card required
        </motion.span>
      </motion.div>
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
