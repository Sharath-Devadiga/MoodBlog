'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-pink-100 px-6 text-center">
      <h1 className="text-5xl font-bold mb-4 text-gray-800">
        Welcome to <span className="text-blue-600">MoodBlog</span>
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mb-6">
        A unique blog platform where users can tag posts with emotions and discover content based on moods.
        Built with <strong>Next.js</strong>, <strong>TypeScript</strong>, <strong>Prisma</strong> & <strong>PostgreSQL</strong>.
      </p>
      <div className="flex gap-4">
        <Link
          href="/signup"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
        <Link
          href="/signin"
          className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}
