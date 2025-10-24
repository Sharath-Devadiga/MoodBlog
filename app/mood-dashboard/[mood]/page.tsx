'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  Smile, 
  CloudRain, 
  HeartCrack, 
  Zap, 
  Sparkles,
  PartyPopper,
  UserX,
  Laugh
} from 'lucide-react';
import Navbar from '@/app/components/layout/NavBar';
import PostList from '@/app/components/posts/PostList';

type Mood = 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'excited' | 'lonely' | 'amused';

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
    icon: <HeartCrack className="w-5 h-5" />,
    gradient: 'from-red-400 to-rose-400',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
  },
  {
    id: 'excited',
    label: 'Excited',
    icon: <PartyPopper className="w-5 h-5" />,
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

export default function MoodDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeMood, setActiveMood] = useState<Mood>((params.mood as Mood) || 'happy');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin');
    } else if (status === 'authenticated' && !(session?.user as { publicUsername?: string })?.publicUsername) {
      router.replace('/create-profile');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (params.mood && ['happy', 'calm', 'anxious', 'sad', 'angry', 'excited', 'lonely', 'amused'].includes(params.mood as string)) {
      setActiveMood(params.mood as Mood);
    }
  }, [params.mood]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const currentMood = moodOptions.find(m => m.id === activeMood) || moodOptions[0];

  const handleMoodChange = (mood: Mood) => {
    setActiveMood(mood);
    router.push(`/mood-dashboard/${mood}`, { scroll: false });
  };

  return (
    <>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="min-h-screen bg-zinc-950 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="hidden lg:block fixed left-4 top-24 z-40 w-56">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`p-4 rounded-xl border border-white/20 ${currentMood.bgColor} backdrop-blur-sm`}>
              <div className={`p-3 bg-gradient-to-br ${currentMood.gradient} rounded-lg mb-3 w-fit`}>
                <div className="text-white">
                  {currentMood.icon}
                </div>
              </div>
              <h2 className="text-lg font-bold text-white mb-1">
                {currentMood.label}
              </h2>
              <p className="text-gray-400 text-sm">
                Mood Dashboard
              </p>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <PostList mood={activeMood} />
          </motion.div>
        </div>
      </div>
    </>
  );
}
