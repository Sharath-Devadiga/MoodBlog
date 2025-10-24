'use client';

import PostList from '@/app/components/posts/PostList';
import { MOODS } from '@/app/utils/constants';
import { notFound, useParams } from 'next/navigation';

export default function MoodPage() {
  const params = useParams();
  const moodParam = (params.mood as string).toLowerCase();

  const isValidMood = MOODS.some((m) => m.value === moodParam);
  if (!isValidMood) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Mood: {moodParam.charAt(0).toUpperCase() + moodParam.slice(1)}
      </h1>

      <PostList mood={moodParam} />
    </div>
  );
}
