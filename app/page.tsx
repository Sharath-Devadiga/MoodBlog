'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Heart, Brain, Zap, Users, Lock, Calendar, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  const features = [
    {
      icon: Brain,
      title: 'Emotion-Tagged Posts',
      description: 'Express yourself with 6 core emotions',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Heart,
      title: 'Like & Comment',
      description: 'Engage with posts that resonate with you',
      gradient: 'from-red-500 to-pink-500',
    },
    {
      icon: Sparkles,
      title: 'Discover by Mood',
      description: 'Explore posts filtered by emotional states',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Lock,
      title: 'Safe & Judgment-Free',
      description: 'Express your true feelings freely',
      gradient: 'from-teal-500 to-cyan-500',
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold"
          >
            <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
              MoodBlog
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            <Link href="/signin" prefetch={true} className="px-5 py-2 text-sm font-medium hover:text-emerald-400 transition-colors">
              Sign In
            </Link>
            <Link href="/signup" prefetch={true} className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-orange-500 to-rose-500 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all">
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8"
            >
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-sm">Where emotions become connections</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              Your feelings deserve
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
                a voice
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              MoodBlog transforms daily experiences into emotional expression. Write posts tagged with your mood, 
              discover content by emotion, and engage with others through likes and comments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/signup"
                prefetch={true}
                className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl font-semibold overflow-hidden hover:shadow-2xl hover:shadow-orange-500/30 transition-all"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Expressing Now
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
              </Link>
              <Link
                href="/signin"
                prefetch={true}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-6">Free forever • No credit card required</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mt-16"
          >
            {emotions.map((emotion, index) => (
              <motion.div
                key={emotion.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className={`${emotion.bg} ${emotion.border} border backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-3 hover:shadow-lg ${emotion.glow} transition-all cursor-pointer`}
              >
                <span className="text-2xl">{emotion.emoji}</span>
                <span className="font-medium">{emotion.name}</span>
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 px-4">
              Everything you need for
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
                emotional wellness
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mt-2 sm:mt-4">A complete platform for authentic self-expression</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
                className="group relative bg-zinc-900 border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
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

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
              Simple yet powerful
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400">Three steps to emotional clarity</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: '01', title: 'Express', desc: 'Write your thoughts and tag with emotions', icon: Brain },
              { step: '02', title: 'Discover', desc: 'Browse posts filtered by different moods', icon: Sparkles },
              { step: '03', title: 'Engage', desc: 'Like and comment on posts that resonate', icon: Heart },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white/5 mb-3 sm:mb-4">{item.step}</div>
                <item.icon className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-zinc-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-zinc-900 border border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 shadow-xl"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Ready to start your
            <br />
            emotional journey?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-10 max-w-2xl mx-auto">
            Join others who are sharing their emotional experiences authentically
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 sm:px-10 py-3 sm:py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl text-base sm:text-lg font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all"
          >
            Create Free Account
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
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
