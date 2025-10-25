'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/app/components/ui/Button';
import Avatar from '@/app/components/ui/Avatar';
import { User, LogOut, Plus, Home, Menu, X, Smile, CloudRain, Angry, Zap, Sparkles, Frown, UserX, Laugh, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const moods = [
  { id: 'happy', label: 'Happy', icon: Smile, gradient: 'from-yellow-400 to-orange-400' },
  { id: 'calm', label: 'Calm', icon: Sparkles, gradient: 'from-emerald-400 to-teal-400' },
  { id: 'anxious', label: 'Anxious', icon: Zap, gradient: 'from-purple-400 to-pink-400' },
  { id: 'sad', label: 'Sad', icon: CloudRain, gradient: 'from-blue-400 to-indigo-400' },
  { id: 'angry', label: 'Angry', icon: Angry, gradient: 'from-red-400 to-rose-400' },
  { id: 'frustrated', label: 'Frustrated', icon: Frown, gradient: 'from-orange-400 to-amber-400' },
  { id: 'lonely', label: 'Lonely', icon: UserX, gradient: 'from-gray-400 to-gray-500' },
  { id: 'amused', label: 'Amused', icon: Laugh, gradient: 'from-pink-400 to-rose-400' },
];

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoodDropdownOpen, setIsMoodDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideDesktop = desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target as Node);
      const isOutsideMobile = mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node);
      
      if (isOutsideDesktop && isOutsideMobile) {
        setIsMoodDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/signin' });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMoodSelect = (e: React.MouseEvent, moodId: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/posts/create?mood=${moodId}`);
    setTimeout(() => {
      setIsMoodDropdownOpen(false);
      setIsMobileMenuOpen(false);
    }, 50);
  };

  return (
    <nav className="bg-zinc-900/95 border-b border-white/10 backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/home" className="flex items-center group">
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent">MoodBlog</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {session ? (
              <>
                <Link href="/home">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                </Link>
                
                <div className="relative" ref={desktopDropdownRef}>
                  <Button 
                    size="sm"
                    onClick={() => setIsMoodDropdownOpen(!isMoodDropdownOpen)}
                    className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Express
                    <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isMoodDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>

                  <AnimatePresence>
                    {isMoodDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 bg-zinc-800 border border-white/10 rounded-xl shadow-2xl py-2 z-50 min-w-[200px]"
                      >
                        <div className="px-3 py-2 border-b border-white/10">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Choose Your Mood</p>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                          {moods.map((mood) => {
                            const Icon = mood.icon;
                            return (
                              <button
                                key={mood.id}
                                onClick={(e) => handleMoodSelect(e, mood.id)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-zinc-700 transition-colors group"
                              >
                                <div className={`p-1.5 bg-gradient-to-br ${mood.gradient} rounded-lg group-hover:scale-110 transition-transform`}>
                                  <Icon className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-medium">{mood.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link href={`/profile/${(session.user as any)?.id}`}>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white flex items-center gap-2">
                    <Avatar 
                      username={(session.user as any)?.publicUsername}
                      animalId={(session.user as any)?.avatarId as string}
                      colorIndex={(session.user as any)?.colorIndex as number}
                      size="sm" 
                    />
                    Profile
                  </Button>
                </Link>

                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-300 hover:text-red-400">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="space-x-2">
                <Link href="/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {session && (
              <div className="relative" ref={mobileDropdownRef}>
                <Button 
                  size="sm"
                  onClick={() => setIsMoodDropdownOpen(!isMoodDropdownOpen)}
                  className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-1.5 py-1 h-6"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>

                <AnimatePresence>
                  {isMoodDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 bg-zinc-800 border border-white/10 rounded-xl shadow-2xl py-2 z-50 min-w-[180px]"
                    >
                      <div className="px-3 py-2 border-b border-white/10">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Choose Mood</p>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {moods.map((mood) => {
                          const Icon = mood.icon;
                          return (
                            <button
                              key={mood.id}
                              onClick={(e) => handleMoodSelect(e, mood.id)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-200 hover:bg-zinc-700 transition-colors group"
                            >
                              <div className={`p-1.5 bg-gradient-to-br ${mood.gradient} rounded-lg group-hover:scale-110 transition-transform`}>
                                <Icon className="w-3.5 h-3.5 text-white" />
                              </div>
                              <span className="font-medium text-sm">{mood.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-3 pt-2 border-t border-white/10">
            <div className="flex flex-col space-y-2 px-2">
              {session ? (
                <>
                  <Link href="/home" onClick={toggleMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </Button>
                  </Link>

                  <Link href={`/profile/${(session.user as any)?.id}`} onClick={toggleMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>

                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-red-500/10"
                    onClick={() => {
                      toggleMobileMenu();
                      handleSignOut();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/signin" onClick={toggleMobileMenu}>
                    <Button variant="ghost" className="w-full justify-center">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={toggleMobileMenu}>
                    <Button className="w-full justify-center">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
