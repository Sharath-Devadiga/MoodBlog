export const MOODS = [
  { value: 'happy', label: 'Happy 😊', color: 'yellow' },
  { value: 'sad', label: 'Sad 😢', color: 'blue' },
  { value: 'angry', label: 'Angry 😠', color: 'red' },
  { value: 'excited', label: 'Excited 🎉', color: 'orange' },
  { value: 'calm', label: 'Calm 😌', color: 'green' },
  { value: 'anxious', label: 'Anxious 😰', color: 'purple' },
] as const;

export type MoodType = typeof MOODS[number]['value'];