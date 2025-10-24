export const MOODS = [
  { value: 'happy', label: 'Happy 😊', color: 'yellow' },
  { value: 'sad', label: 'Sad 😢', color: 'blue' },
  { value: 'angry', label: 'Angry 😠', color: 'red' },
  { value: 'frustrated', label: 'Frustrated 😤', color: 'orange' },
  { value: 'calm', label: 'Calm 😌', color: 'green' },
  { value: 'anxious', label: 'Anxious 😰', color: 'purple' },
  { value: 'lonely', label: 'Lonely 😔', color: 'gray' },
  { value: 'amused', label: 'Amused 😂', color: 'pink' },
] as const;

export type MoodType = typeof MOODS[number]['value'];

export const AVATAR_COLORS = [
  'bg-gradient-to-br from-red-500 to-pink-500',
  'bg-gradient-to-br from-orange-500 to-amber-500',
  'bg-gradient-to-br from-yellow-500 to-orange-500',
  'bg-gradient-to-br from-green-500 to-emerald-500',
  'bg-gradient-to-br from-teal-500 to-cyan-500',
  'bg-gradient-to-br from-blue-500 to-indigo-500',
  'bg-gradient-to-br from-purple-500 to-pink-500',
  'bg-gradient-to-br from-pink-500 to-rose-500',
  'bg-gradient-to-br from-indigo-500 to-purple-500',
  'bg-gradient-to-br from-cyan-500 to-blue-500',
  'bg-gradient-to-br from-emerald-500 to-teal-500',
  'bg-gradient-to-br from-amber-500 to-yellow-500',
] as const;

export const AVATAR_ANIMALS = [
  { id: 'cat', emoji: '🐱', name: 'Cat' },
  { id: 'dog', emoji: '�', name: 'Dog' },
  { id: 'fox', emoji: '🦊', name: 'Fox' },
  { id: 'panda', emoji: '🐼', name: 'Panda' },
  { id: 'koala', emoji: '🐨', name: 'Koala' },
  { id: 'lion', emoji: '🦁', name: 'Lion' },
  { id: 'tiger', emoji: '🐯', name: 'Tiger' },
  { id: 'bear', emoji: '🐻', name: 'Bear' },
  { id: 'monkey', emoji: '�', name: 'Monkey' },
  { id: 'rabbit', emoji: '🐰', name: 'Rabbit' },
  { id: 'hamster', emoji: '🐹', name: 'Hamster' },
  { id: 'frog', emoji: '🐸', name: 'Frog' },
  { id: 'pig', emoji: '🐷', name: 'Pig' },
  { id: 'penguin', emoji: '🐧', name: 'Penguin' },
  { id: 'chicken', emoji: '🐔', name: 'Chicken' },
  { id: 'bird', emoji: '🐦', name: 'Bird' },
  { id: 'owl', emoji: '🦉', name: 'Owl' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn' },
] as const;

export const getRandomColor = (seed?: string) => {
  if (!seed) {
    return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
  }
  const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

export const getColorByIndex = (index: number | null | undefined) => {
  if (index === null || index === undefined) {
    return AVATAR_COLORS[0];
  }
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
};

export const getRandomColorIndex = () => {
  return Math.floor(Math.random() * AVATAR_COLORS.length);
};

export const getAvatarAnimal = (animalId: string | null | undefined) => {
  if (!animalId) return null;
  return AVATAR_ANIMALS.find(a => a.id === animalId) || null;
};
