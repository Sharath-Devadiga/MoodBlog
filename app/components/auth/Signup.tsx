'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, UserPlus, Shield } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { authAPI } from '@/app/utils/api';

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SignUpFormData>();

  const password = watch('password');

  const sendOTP = async (emailValue: string) => {
    setSendingOtp(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: emailValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to send OTP');
        return false;
      }

      toast.success('OTP sent to your email');
      setOtpSent(true);
      return true;
    } catch (error) {
      toast.error('Failed to send OTP');
      return false;
    } finally {
      setSendingOtp(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailValue = (e.target as any).email.value;
    
    if (!emailValue) {
      toast.error('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      toast.error('Invalid email address');
      return;
    }

    setEmail(emailValue);
    const sent = await sendOTP(emailValue);
    if (sent) {
      setStep('otp');
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = (e.target as any).otp.value;

    if (!otpValue || otpValue.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setVerifyingOtp(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Invalid OTP');
        return;
      }

      toast.success('Email verified successfully');
      setStep('password');
    } catch (error) {
      toast.error('OTP verification failed');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authAPI.signup({
        email,
        password: data.password,
      });
      
      toast.success('Account created! Please sign in to continue.');
      router.push('/signin');
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('Email already exists. Please use different email.');
      } else if (error.response?.status === 403) {
        toast.error('Email not verified. Please verify your email first.');
        setStep('email');
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem]" />
      
      <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-rose-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

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
              className="inline-flex p-2 sm:p-2.5 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl mb-2 sm:mb-3"
            >
              {step === 'email' && <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
              {step === 'otp' && <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
              {step === 'password' && <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold mb-1">
              <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                {step === 'email' && 'Create Account'}
                {step === 'otp' && 'Verify Email'}
                {step === 'password' && 'Set Password'}
              </span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">
              {step === 'email' && 'Start your emotional wellness journey'}
              {step === 'otp' && 'Enter the OTP sent to your email'}
              {step === 'password' && 'Create a secure password'}
            </p>
          </div>

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-3 sm:space-y-3.5">
              <div className="space-y-1 sm:space-y-1.5">
                <label htmlFor="email" className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400" />
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:ring-orange-500/20 py-2 text-sm"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={sendingOtp}
                className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold py-2 sm:py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-3 sm:mt-4"
              >
                {sendingOtp ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP
                    <Mail className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOTPSubmit} className="space-y-3 sm:space-y-3.5">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-3">
                <p className="text-orange-200 text-xs">
                  OTP sent to <strong>{email}</strong>
                </p>
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <label htmlFor="otp" className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400" />
                  Enter OTP
                </label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:ring-orange-500/20 py-2 text-center tracking-widest text-lg"
                  required
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setStep('email')}
                  className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold py-2 sm:py-2.5 rounded-xl text-sm"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={verifyingOtp}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold py-2 sm:py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {verifyingOtp ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify OTP
                    </>
                  )}
                </Button>
              </div>

              <button
                type="button"
                onClick={() => sendOTP(email)}
                disabled={sendingOtp}
                className="text-xs text-orange-400 hover:text-orange-300 transition-colors mt-2 disabled:opacity-50"
              >
                {sendingOtp ? 'Sending...' : 'Resend OTP'}
              </button>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-3.5">
              <div className="space-y-1 sm:space-y-1.5">
                <label htmlFor="password" className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
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
                  className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-amber-500/50 focus:ring-amber-500/20 py-2 text-sm ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
                {errors.password && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <span>⚠</span> {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  type="password"
                  placeholder="••••••••"
                  className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:ring-emerald-500/20 py-2 text-sm ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <span>⚠</span> {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold py-2 sm:py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-3 sm:mt-4"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Account
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="mt-3 sm:mt-4 text-center">
            <p className="text-gray-400 text-xs">
              Already have an account?{' '}
              <Link href="/signin" prefetch={true} className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
