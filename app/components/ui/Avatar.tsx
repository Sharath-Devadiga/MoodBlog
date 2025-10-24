'use client';

import { getColorByIndex, getAvatarAnimal } from '@/app/utils/constants';

interface AvatarProps {
  username?: string | null;
  animalId?: string | null;
  colorIndex?: number | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-base',
  md: 'w-10 h-10 text-lg md:w-12 md:h-12 md:text-xl',
  lg: 'w-16 h-16 text-3xl',
  xl: 'w-24 h-24 text-5xl',
};

export default function Avatar({ 
  username, 
  animalId, 
  colorIndex, 
  size = 'md', 
  className = '' 
}: AvatarProps) {
  const animal = getAvatarAnimal(animalId);
  const bgColor = getColorByIndex(colorIndex);
  
  const firstLetter = username?.charAt(0).toUpperCase() || '?';

  return (
    <div
      className={`${bgColor} ${sizeClasses[size]} rounded-full flex items-center justify-center shadow-lg font-bold text-white ${className}`}
    >
      {animal ? (
        <span className="select-none">{animal.emoji}</span>
      ) : (
        <span className="select-none">{firstLetter}</span>
      )}
    </div>
  );
}
