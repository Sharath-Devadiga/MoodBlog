const adjectives = [
  'Calm', 'Happy', 'Peaceful', 'Bright', 'Swift', 'Silent', 'Brave', 'Wise',
  'Noble', 'Gentle', 'Mystic', 'Azure', 'Golden', 'Silver', 'Crystal', 'Shadow',
  'Stellar', 'Cosmic', 'Lunar', 'Solar', 'Ocean', 'Mountain', 'Forest', 'Desert',
  'Arctic', 'Tropical', 'Ancient', 'Modern', 'Wild', 'Tame', 'Free', 'Bold',
  'Fierce', 'Serene', 'Vibrant', 'Radiant', 'Midnight', 'Dawn', 'Twilight', 'Zenith'
];

const animals = [
  'Dolphin', 'Eagle', 'Wolf', 'Tiger', 'Bear', 'Fox', 'Hawk', 'Owl',
  'Falcon', 'Raven', 'Phoenix', 'Dragon', 'Panda', 'Lynx', 'Jaguar', 'Leopard',
  'Cheetah', 'Orca', 'Shark', 'Whale', 'Seal', 'Otter', 'Penguin', 'Swan',
  'Crane', 'Heron', 'Sparrow', 'Robin', 'Deer', 'Elk', 'Moose', 'Bison',
  'Lion', 'Panther', 'Cougar', 'Badger', 'Raccoon', 'Squirrel', 'Rabbit', 'Hare'
];

export function generateRandomUsername(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(Math.random() * 100);
  
  return `${adjective}${animal}${number}`;
}

export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }

  const trimmed = username.trim();

  if (trimmed.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters long' };
  }

  if (trimmed.length > 30) {
    return { valid: false, error: 'Username must not exceed 30 characters' };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }

  return { valid: true };
}
