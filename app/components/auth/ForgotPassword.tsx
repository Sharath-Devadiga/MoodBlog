'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';

type Step = 'email' | 'otp' | 'newPassword' | 'success';

interface EmailFormData {
  email: string;
}

interface OTPFormData {
  otp: string;
}

interface PasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const emailForm = useForm<EmailFormData>();
  const otpForm = useForm<OTPFormData>();
  const passwordForm = useForm<PasswordFormData>();

  const handleEmailSubmit = async (data: EmailFormData) => {
    setLoading(true);
    try {
      const normalizedEmail = data.email.toLowerCase().trim();
      
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Failed to send OTP');
        return;
      }

      setEmail(normalizedEmail);
      toast.success('OTP sent to your email!');
      
      
      if (result.otp) {
        toast.success(`Development OTP: ${result.otp}`, { duration: 10000 });
      }
      
      setStep('otp');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (data: OTPFormData) => {
    setLoading(true);
    try {
      const normalizedOtp = data.otp.trim();
      
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: normalizedOtp }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Invalid OTP');
        return;
      }

      setOtp(normalizedOtp);
      toast.success('OTP verified!');
      setStep('newPassword');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Failed to reset password');
        return;
      }

      toast.success('Password reset successfully!');
      setStep('success');
      
      
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (error) {
      toast.error('Something went wrong');
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
          
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-xs mb-4 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Sign In
          </Link>

          <AnimatePresence mode="wait">
            
            {step === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center mb-5 sm:mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="inline-flex p-2 sm:p-2.5 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl mb-2 sm:mb-3"
                  >
                    <KeyRound className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </motion.div>
                  <h1 className="text-xl sm:text-2xl font-bold mb-1">
                    <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                      Forgot Password?
                    </span>
                  </h1>
                  <p className="text-gray-400 text-xs sm:text-sm">Enter your email to receive an OTP</p>
                </div>

                <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-3.5 sm:space-y-4">
                  <div className="space-y-1 sm:space-y-1.5">
                    <label htmlFor="email" className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400" />
                      Email Address
                    </label>
                    <Input
                      id="email"
                      {...emailForm.register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      placeholder="you@example.com"
                      className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:ring-orange-500/20 py-2 text-sm ${
                        emailForm.formState.errors.email ? 'border-red-500' : ''
                      }`}
                    />
                    {emailForm.formState.errors.email && (
                      <p className="text-red-400 text-xs flex items-center gap-1">
                        <span>⚠</span> {emailForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold py-2 sm:py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-4 sm:mt-5"
                  >
                    {loading ? (
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
              </motion.div>
            )}

            
            {step === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center mb-5 sm:mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="inline-flex p-2 sm:p-2.5 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl mb-2 sm:mb-3"
                  >
                    <KeyRound className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </motion.div>
                  <h1 className="text-xl sm:text-2xl font-bold mb-1">
                    <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                      Enter OTP
                    </span>
                  </h1>
                  <p className="text-gray-400 text-xs sm:text-sm">We sent a 6-digit code to {email}</p>
                </div>

                <form onSubmit={otpForm.handleSubmit(handleOTPSubmit)} className="space-y-3.5 sm:space-y-4">
                  <div className="space-y-1 sm:space-y-1.5">
                    <label htmlFor="otp" className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                      <KeyRound className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400" />
                      6-Digit OTP
                    </label>
                    <Input
                      id="otp"
                      {...otpForm.register('otp', {
                        required: 'OTP is required',
                        pattern: {
                          value: /^\d{6}$/,
                          message: 'OTP must be 6 digits'
                        }
                      })}
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-rose-500/50 focus:ring-rose-500/20 py-2 text-center text-2xl tracking-widest ${
                        otpForm.formState.errors.otp ? 'border-red-500' : ''
                      }`}
                    />
                    {otpForm.formState.errors.otp && (
                      <p className="text-red-400 text-xs flex items-center gap-1">
                        <span>⚠</span> {otpForm.formState.errors.otp.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold py-2 sm:py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-4 sm:mt-5"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify OTP
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => handleEmailSubmit({ email })}
                    disabled={loading}
                    className="w-full text-center text-xs text-gray-400 hover:text-orange-400 transition-colors disabled:opacity-50"
                  >
                    Didn't receive? Resend OTP
                  </button>
                </form>
              </motion.div>
            )}

            
            {step === 'newPassword' && (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center mb-5 sm:mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="inline-flex p-2 sm:p-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mb-2 sm:mb-3"
                  >
                    <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </motion.div>
                  <h1 className="text-xl sm:text-2xl font-bold mb-1">
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-orange-400 bg-clip-text text-transparent">
                      Set New Password
                    </span>
                  </h1>
                  <p className="text-gray-400 text-xs sm:text-sm">Create a strong password for your account</p>
                </div>

                <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-3.5 sm:space-y-4">
                  <div className="space-y-1 sm:space-y-1.5">
                    <label htmlFor="newPassword" className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                      New Password
                    </label>
                    <Input
                      id="newPassword"
                      {...passwordForm.register('newPassword', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      type="password"
                      placeholder="••••••••"
                      className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:ring-emerald-500/20 py-2 text-sm ${
                        passwordForm.formState.errors.newPassword ? 'border-red-500' : ''
                      }`}
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-red-400 text-xs flex items-center gap-1">
                        <span>⚠</span> {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 sm:space-y-1.5">
                    <label htmlFor="confirmPassword" className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400" />
                      Confirm Password
                    </label>
                    <Input
                      id="confirmPassword"
                      {...passwordForm.register('confirmPassword', {
                        required: 'Please confirm your password',
                      })}
                      type="password"
                      placeholder="••••••••"
                      className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-teal-500/20 py-2 text-sm ${
                        passwordForm.formState.errors.confirmPassword ? 'border-red-500' : ''
                      }`}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-red-400 text-xs flex items-center gap-1">
                        <span>⚠</span> {passwordForm.formState.errors.confirmPassword.message}
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
                        Resetting...
                      </>
                    ) : (
                      <>
                        Reset Password
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="inline-flex p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-orange-400 bg-clip-text text-transparent">
                    Password Reset!
                  </span>
                </h1>
                <p className="text-gray-400 text-sm mb-4">
                  Your password has been successfully reset.
                </p>
                <p className="text-gray-500 text-xs">
                  Redirecting to sign in...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
