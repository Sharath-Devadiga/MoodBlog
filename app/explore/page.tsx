'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smile, 
  CloudRain, 
  Angry, 
  Zap, 
  Sparkles,
  Frown,
  UserX,
  Laugh,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import PostList from '@/app/components/posts/PostList';

type Mood = 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'frustrated' | 'lonely' | 'amused';

interface MoodOption {
  id: Mood;
  label: string;
  icon: React.ReactNode;
  gradient: string;
  color: string;
  bgColor: string;
}

const moodOptions: MoodOption[] = [
  {
    id: 'happy',
    label: 'Happy',
    icon: <Smile className="w-5 h-5" />,
    gradient: 'from-yellow-400 to-orange-400',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  {
    id: 'calm',
    label: 'Calm',
    icon: <Sparkles className="w-5 h-5" />,
    gradient: 'from-emerald-400 to-teal-400',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    id: 'anxious',
    label: 'Anxious',
    icon: <Zap className="w-5 h-5" />,
    gradient: 'from-purple-400 to-pink-400',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 'sad',
    label: 'Sad',
    icon: <CloudRain className="w-5 h-5" />,
    gradient: 'from-blue-400 to-indigo-400',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'angry',
    label: 'Angry',
    icon: <Angry className="w-5 h-5" />,
    gradient: 'from-red-400 to-rose-400',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
  },
  {
    id: 'frustrated',
    label: 'Frustrated',
    icon: <Frown className="w-5 h-5" />,
    gradient: 'from-orange-400 to-amber-400',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
  {
    id: 'lonely',
    label: 'Lonely',
    icon: <UserX className="w-5 h-5" />,
    gradient: 'from-gray-400 to-gray-500',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
  },
  {
    id: 'amused',
    label: 'Amused',
    icon: <Laugh className="w-5 h-5" />,
    gradient: 'from-pink-400 to-rose-400',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
];

export default function ExplorePage() {
  const router = useRouter();
  const [activeMood, setActiveMood] = useState<Mood | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentMood = activeMood ? moodOptions.find(m => m.id === activeMood) : null;

  const handleMoodChange = (mood: Mood | null) => {
    setActiveMood(mood);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-lg border-b border-white/10 shadow-lg will-change-transform">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
              MoodBlog
            </span>
          </Link>
          <div className="flex gap-2 sm:gap-3">
            <Link href="/signin">
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">
                Sign In
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-rose-500 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="min-h-screen bg-zinc-950 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-3xl sm:text-4xl"
              >
                🌟
              </motion.span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
                    Explore
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                  {activeMood && currentMood
                    ? `${currentMood.label} moments`
                    : 'All moods & stories'}
                </p>
              </div>
            </div>

            <div className="relative">
              <motion.button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeMood && currentMood
                    ? `bg-gradient-to-r ${currentMood.gradient} text-white shadow-lg`
                    : 'bg-zinc-900/50 border border-white/10 text-gray-300 hover:border-white/20 hover:bg-zinc-800/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeMood && currentMood ? (
                  <>
                    <span className="w-4 h-4">{currentMood.icon}</span>
                    <span className="hidden sm:inline">{currentMood.label}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Filter</span>
                  </>
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsDropdownOpen(false)}
                      className="fixed inset-0 z-30"
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-zinc-900/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-40"
                    >
                      <div className="p-1.5 max-h-80 overflow-y-auto">
                        <button
                          onClick={() => handleMoodChange(null)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                            !activeMood
                              ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
                              : 'text-gray-300 hover:bg-zinc-800/70 hover:text-white'
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                          <span className="font-medium">All Posts</span>
                          {!activeMood && (
                            <span className="ml-auto text-xs bg-white/20 px-1.5 py-0.5 rounded">
                              ✓
                            </span>
                          )}
                        </button>

                        <div className="h-px bg-white/10 my-1.5" />

                        <div className="grid grid-cols-2 gap-1">
                          {moodOptions.map((mood) => {
                            const isActive = activeMood === mood.id;
                            return (
                              <button
                                key={mood.id}
                                onClick={() => handleMoodChange(mood.id)}
                                className={`flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg text-xs transition-all ${
                                  isActive
                                    ? `bg-gradient-to-br ${mood.gradient} text-white shadow-md`
                                    : 'text-gray-400 hover:bg-zinc-800/70 hover:text-white'
                                }`}
                              >
                                <span className={`w-5 h-5 ${isActive ? 'text-white' : mood.color}`}>
                                  {mood.icon}
                                </span>
                                <span className="font-medium">{mood.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence>
            {activeMood && currentMood && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-white/10 text-sm"
              >
                <span className="text-gray-400">Filtering:</span>
                <div className={`flex items-center gap-1.5 ${currentMood.color}`}>
                  <span className="w-4 h-4">{currentMood.icon}</span>
                  <span className="font-medium text-white">{currentMood.label}</span>
                </div>
                <button
                  onClick={() => handleMoodChange(null)}
                  className="ml-1 p-0.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <PostList mood={activeMood || undefined} />
        </motion.div>
        </div>
      </div>
    </>
  );
}
