'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Smile, 
  CloudRain, 
  HeartCrack, 
  Zap, 
  Sparkles,
  UserX,
  Laugh,
  PartyPopper
} from 'lucide-react';
import Navbar from '@/app/components/layout/NavBar';

type Mood = 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'excited' | 'lonely' | 'amused';

interface MoodOption {
  id: Mood;
  label: string;
  icon: React.ReactNode;
  gradient: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  {
    id: 'happy',
    label: 'Happy',
    icon: <Smile className="w-8 h-8" />,
    gradient: 'from-yellow-400 to-orange-400',
    color: 'text-yellow-400',
  },
  {
    id: 'calm',
    label: 'Calm',
    icon: <Sparkles className="w-8 h-8" />,
    gradient: 'from-emerald-400 to-teal-400',
    color: 'text-emerald-400',
  },
  {
    id: 'anxious',
    label: 'Anxious',
    icon: <Zap className="w-8 h-8" />,
    gradient: 'from-purple-400 to-pink-400',
    color: 'text-purple-400',
  },
  {
    id: 'sad',
    label: 'Sad',
    icon: <CloudRain className="w-8 h-8" />,
    gradient: 'from-blue-400 to-indigo-400',
    color: 'text-blue-400',
  },
  {
    id: 'angry',
    label: 'Angry',
    icon: <HeartCrack className="w-8 h-8" />,
    gradient: 'from-red-400 to-rose-400',
    color: 'text-red-400',
  },
  {
    id: 'excited',
    label: 'Excited',
    icon: <PartyPopper className="w-8 h-8" />,
    gradient: 'from-orange-400 to-amber-400',
    color: 'text-orange-400',
  },
  {
    id: 'lonely',
    label: 'Lonely',
    icon: <UserX className="w-8 h-8" />,
    gradient: 'from-gray-400 to-gray-500',
    color: 'text-gray-400',
  },
  {
    id: 'amused',
    label: 'Amused',
    icon: <Laugh className="w-8 h-8" />,
    gradient: 'from-pink-400 to-rose-400',
    color: 'text-pink-400',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin');
    } else if (status === 'authenticated' && session?.user && !(session.user as { publicUsername?: string })?.publicUsername) {
      router.replace('/create-profile');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated' || !(session?.user as { publicUsername?: string })?.publicUsername) {
    return null;
  }

  const handleMoodSelect = (mood: Mood) => {
    router.push(`/mood-dashboard/${mood}`);
  };

  return (
    <>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 px-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
                    How are you feeling?
                  </span>
                </motion.h1>
                <motion.p 
                  className="text-gray-400 text-base sm:text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Choose your current mood
                </motion.p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {moodOptions.map((mood, index) => (
                  <motion.button
                    key={mood.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMoodSelect(mood.id)}
                    className="group relative bg-zinc-900 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 hover:border-white/20 transition-all duration-300 hover:shadow-xl"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-0 group-hover:opacity-10 rounded-xl sm:rounded-2xl transition-opacity duration-300`} />
                    
                    <div className="relative flex flex-col items-center gap-2 sm:gap-3">
                      <div className={`${mood.color} transition-transform duration-300 group-hover:scale-110`}>
                        {mood.icon}
                      </div>
                      <span className="text-white font-medium text-xs sm:text-sm md:text-base">
                        {mood.label}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
      </div>
    </div>
    </>
  );
}
