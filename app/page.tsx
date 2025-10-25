'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Brain, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: 'Emotion-Tagged Posts',
      description: 'Express yourself with 8 different moods',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: ShieldCheck,
      title: '100% Anonymous',
      description: 'Complete privacy with random usernames',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Sparkles,
      title: 'Discover by Mood',
      description: 'Explore posts filtered by emotions',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Heart,
      title: 'Engage & Connect',
      description: 'Like and comment on posts that resonate',
      gradient: 'from-red-500 to-rose-500',
    },
  ];

  const emotions = [
    { emoji: '😊', name: 'Happy', bg: 'bg-amber-500/20', border: 'border-amber-500/30', glow: 'shadow-amber-500/50' },
    { emoji: '😢', name: 'Sad', bg: 'bg-slate-500/20', border: 'border-slate-500/30', glow: 'shadow-slate-500/50' },
    { emoji: '😡', name: 'Angry', bg: 'bg-red-500/20', border: 'border-red-500/30', glow: 'shadow-red-500/50' },
    { emoji: '🎉', name: 'Excited', bg: 'bg-orange-500/20', border: 'border-orange-500/30', glow: 'shadow-orange-500/50' },
    { emoji: '😌', name: 'Calm', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/50' },
    { emoji: '😰', name: 'Anxious', bg: 'bg-pink-500/20', border: 'border-pink-500/30', glow: 'shadow-pink-500/50' },
  ];

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg sm:text-xl md:text-2xl font-bold"
          >
            <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
              MoodBlog
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2 sm:gap-4"
          >
            <Link href="/signin" prefetch={true} className="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:text-emerald-400 transition-colors">
              Sign In
            </Link>
            <Link href="/signup" prefetch={true} className="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-gradient-to-r from-orange-500 to-rose-500 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all">
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      <section className="relative pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-orange-500/20 rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-70" />
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3 mb-6 sm:mb-8 shadow-lg shadow-emerald-500/20"
            >
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              <span className="text-sm sm:text-base md:text-lg font-semibold text-emerald-400">
                100% Anonymous • Express Freely Without Identity
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight px-4">
              Your feelings deserve
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
                a voice
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4">
              Share your daily experiences tagged with emotions. Connect with others through authentic self-expression.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <Link
                href="/explore"
                prefetch={true}
                className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl font-semibold overflow-hidden hover:shadow-2xl hover:shadow-orange-500/30 transition-all text-base sm:text-lg"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Explore MoodBlogs
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform" />
                </span>
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">Browse posts without signing up • Sign up to express yourself</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mt-12 sm:mt-16 px-4"
          >
            {emotions.map((emotion, index) => (
              <motion.div
                key={emotion.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={`${emotion.bg} ${emotion.border} border backdrop-blur-sm px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full flex items-center gap-2 sm:gap-3 hover:shadow-lg ${emotion.glow} transition-shadow cursor-pointer will-change-transform`}
              >
                <span className="text-xl sm:text-2xl">{emotion.emoji}</span>
                <span className="font-medium text-sm sm:text-base">{emotion.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
                Why MoodBlog?
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -8 }}
                className="group relative bg-zinc-900 border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 transition-all will-change-transform"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                <div className={`inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} mb-4 sm:mb-6`}>
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-zinc-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto text-center bg-zinc-900 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-xl"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6">
            Start expressing yourself
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
            Join anonymously and share your emotions freely
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl text-sm sm:text-base md:text-lg font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all"
          >
            Get Started Free
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </Link>
        </motion.div>
      </section>

      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-white/10 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center">
            <div className="text-gray-400 text-xs sm:text-sm">
              © 2025 MoodBlog. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
