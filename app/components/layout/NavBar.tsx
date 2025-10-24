'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/app/components/ui/Button';
import Avatar from '@/app/components/ui/Avatar';
import { User, LogOut, Plus, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  
  const currentMood = pathname?.match(/mood-dashboard\/(\w+)/)?.[1] || 'happy';

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/signin' });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-zinc-900 border-b border-white/10 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/home" className="flex items-center space-x-2 group">
              <Image 
                src="/new1.png" 
                alt="MoodBlog Logo" 
                width={32} 
                height={32}
                className="rounded-full transition-transform group-hover:scale-110"
              />
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
                
                <Link href={`/posts/create?mood=${currentMood}`}>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Express
                  </Button>
                </Link>

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

          
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
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
                  
                  <Link href={`/posts/create?mood=${currentMood}`} onClick={toggleMobileMenu}>
                    <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-rose-500 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Express
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