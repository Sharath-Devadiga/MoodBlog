'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MOODS } from '@/app/utils/constants';
import { Button } from '@/app/components/ui/Button';

export default function MoodFilter() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Filter by Mood</h3>
      <div className="flex flex-wrap gap-2">
        <Link href="/dashboard">
          <Button variant={isActive('/dashboard') ? 'default' : 'outline'} size="sm">
            All Posts
          </Button>
        </Link>

        {MOODS.map((mood) => {
          const href = `/posts/mood/${mood.value}`;
          return (
            <Link key={mood.value} href={href}>
              <Button variant={isActive(href) ? 'default' : 'outline'} size="sm">
                {mood.label}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
