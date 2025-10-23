'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card';

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
        toast.error('Invalid email or password. Please try again.');
      } else {
        toast.success('Welcome back! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 500);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 px-4 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to Home Link */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-700 hover:text-blue-600 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90">
          <CardHeader className="space-y-2 pb-6">
            <div className="flex justify-center mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                <LogIn className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <p className="text-center text-gray-600">Sign in to continue your journey</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <Input
                  id="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className={`transition-all ${errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                  disabled={loading}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm flex items-center gap-1"
                  >
                    <span className="text-red-500">⚠</span> {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <Input
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type="password"
                  placeholder="••••••••"
                  className={`transition-all ${errors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                  disabled={loading}
                />
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm flex items-center gap-1"
                  >
                    <span className="text-red-500">⚠</span> {errors.password.message}
                  </motion.p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                isLoading={loading}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to MoodBlog?</span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/signup"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                >
                  Create a free account →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-6">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
