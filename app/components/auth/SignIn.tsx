'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';

interface SignInFormData {
  email: string;
  password: string;
}

export default function SignInForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password. Please check your credentials.');
        setLoading(false);
      } else if (result?.ok) {
        toast.success('Welcome back!');
        
        setTimeout(async () => {
          const response = await fetch('/api/auth/session');
          const session = await response.json();
          
          if (session?.user?.publicUsername) {
            router.push('/home');
          } else {
            router.push('/create-profile');
          }
        }, 500);
      } else {
        toast.error('Something went wrong during sign in');
        setLoading(false);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-4 relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem]" />
      
      
      <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        
        <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-5 sm:p-6">
          
          <div className="text-center mb-5 sm:mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="inline-flex p-2 sm:p-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mb-2 sm:mb-3"
            >
              <LogIn className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold mb-1">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-orange-400 bg-clip-text text-transparent">
                Welcome Back
              </span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">Continue your emotional journey</p>
          </div>

          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 sm:space-y-4">
            
            <div className="space-y-1 sm:space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                Email Address
              </label>
              <Input
                id="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                placeholder="you@example.com"
                className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:ring-emerald-500/20 py-2 text-sm ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            
            <div className="space-y-1 sm:space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400" />
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                {...register('password', {
                  required: 'Password is required'
                })}
                type="password"
                placeholder="••••••••"
                className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:ring-orange-500/20 py-2 text-sm ${
                  errors.password ? 'border-red-500' : ''
                }`}
              />
              {errors.password && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-2 sm:py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-4 sm:mt-5"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 sm:mt-5 text-center">
            <p className="text-gray-400 text-xs">
              Don't have an account?{' '}
              <Link href="/signup" prefetch={true} className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
