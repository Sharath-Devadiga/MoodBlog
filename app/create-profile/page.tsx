'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, User, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { generateRandomUsername, validateUsername } from '@/app/utils/username';

export default function CreateProfilePage() {
  const [publicUsername, setPublicUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status, update } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
      return;
    }

    if (status === 'authenticated' && (session?.user as { publicUsername?: string })?.publicUsername) {
      router.replace('/home');
      return;
    }

    setPublicUsername(generateRandomUsername());
  }, [status, session, router]);

  const handleShuffle = () => {
    setPublicUsername(generateRandomUsername());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateUsername(publicUsername);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid username');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/create-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicUsername: publicUsername.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast.error('Username already taken. Please choose a different one.');
          handleShuffle();
        } else if (response.status === 403) {
          toast.error('Profile already created!');
          await update();
          router.push('/home');
        } else {
          toast.error(data.error || 'Failed to create profile');
        }
        setLoading(false);
        return;
      }

      toast.success('Profile created successfully!');
      
      await update();

      router.push('/home');
      router.refresh();
    } catch (error) {
      toast.error('An unexpected error occurred');
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem]" />
      
      <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="inline-flex p-3 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl mb-3"
            >
              <User className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
                Create Your Profile
              </span>
            </h1>
            <p className="text-gray-400 text-sm">
              Choose a pseudonymous username to protect your privacy
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="publicUsername" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                Your Anonymous Username
              </label>
              <div className="flex gap-2">
                <Input
                  id="publicUsername"
                  value={publicUsername}
                  onChange={(e) => setPublicUsername(e.target.value)}
                  placeholder="CalmDolphin47"
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:ring-orange-500/20 py-2.5 text-base"
                  maxLength={30}
                />
                <Button
                  type="button"
                  onClick={handleShuffle}
                  className="px-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  title="Generate new username"
                >
                  <RefreshCw className="w-5 h-5 text-emerald-400" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                3-30 characters • Letters, numbers, and underscores only
              </p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <div className="flex gap-3">
                <span className="text-amber-400 text-xl">🔒</span>
                <div className="flex-1">
                  <p className="text-amber-200 text-sm font-medium mb-1">
                    Privacy Protection
                  </p>
                  <p className="text-amber-200/70 text-xs">
                    Your email stays private. Only this username will be visible to others.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !publicUsername.trim()}
              className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Continue to MoodBlog
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              You cannot change your username later
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
