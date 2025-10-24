'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Smile, CloudRain, HeartCrack, Zap, Sparkles, Image as ImageIcon, X, PartyPopper, UserX, Laugh } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Textarea } from '@/app/components/ui/TextArea';

type Mood = 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'excited' | 'lonely' | 'amused';

const moodIcons: Record<Mood, React.ReactNode> = {
  happy: <Smile className="w-6 h-6" />,
  calm: <Sparkles className="w-6 h-6" />,
  anxious: <Zap className="w-6 h-6" />,
  sad: <CloudRain className="w-6 h-6" />,
  angry: <HeartCrack className="w-6 h-6" />,
  excited: <PartyPopper className="w-6 h-6" />,
  lonely: <UserX className="w-6 h-6" />,
  amused: <Laugh className="w-6 h-6" />,
};

const moodGradients: Record<Mood, string> = {
  happy: 'from-yellow-400 to-orange-400',
  calm: 'from-emerald-400 to-teal-400',
  anxious: 'from-purple-400 to-pink-400',
  sad: 'from-blue-400 to-indigo-400',
  angry: 'from-red-400 to-rose-400',
  excited: 'from-orange-400 to-amber-400',
  lonely: 'from-gray-400 to-gray-500',
  amused: 'from-pink-400 to-rose-400',
};

const moodColors: Record<Mood, string> = {
  happy: 'text-yellow-400',
  calm: 'text-emerald-400',
  anxious: 'text-purple-400',
  sad: 'text-blue-400',
  angry: 'text-red-400',
  excited: 'text-orange-400',
  lonely: 'text-gray-400',
  amused: 'text-pink-400',
};

export default function CreatePostPage() {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  
  const mood = searchParams.get('mood') as Mood | null;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin');
    } else if (status === 'authenticated' && !(session?.user as any)?.publicUsername) {
      router.replace('/create-profile');
    } else if (!mood || !['happy', 'calm', 'anxious', 'sad', 'angry', 'excited', 'lonely', 'amused'].includes(mood)) {
      router.replace('/home');
    }
  }, [status, session, mood, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!mood) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && !selectedImage) {
      toast.error('Please write something or add an image');
      return;
    }

    if (content.length > 1000) {
      toast.error('Post is too long (max 1000 characters)');
      return;
    }

    setLoading(true);
    try {
      let imageUrl: string | undefined;

      if (selectedImage) {
        setUploading(true);
        toast.loading('Uploading image...');
        imageUrl = await uploadImage(selectedImage);
        toast.dismiss();
        setUploading(false);
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim() || undefined,
          imageUrl,
          mood,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || 'Failed to create post');
        return;
      }

      toast.success('Post created successfully!');
      router.push(`/mood-dashboard/${mood}`);
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const moodCapitalized = mood.charAt(0).toUpperCase() + mood.slice(1);

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <div className={`absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br ${moodGradients[mood]} opacity-10 rounded-full blur-3xl animate-pulse`} />

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 bg-gradient-to-br ${moodGradients[mood]} rounded-xl`}>
                <div className="text-white">
                  {moodIcons[mood]}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  <span className={moodColors[mood]}>Express Your Feelings</span>
                </h1>
                <p className="text-gray-400 text-sm">
                  Feeling {moodCapitalized}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Textarea
                  value={content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                  placeholder="What's on your mind? Share your thoughts..."
                  rows={6}
                  maxLength={1000}
                  className="w-full bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:ring-orange-500/20 rounded-xl resize-none"
                  autoFocus
                />
                <div className="mt-2 text-right text-sm text-gray-500">
                  {content.length} / 1000
                </div>
              </div>

              
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={800}
                      height={256}
                      className="w-full h-64 object-cover rounded-xl border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-white/10 hover:border-white/20 rounded-xl p-8 transition-all duration-300 hover:bg-white/5 group"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className={`p-3 bg-gradient-to-br ${moodGradients[mood]} rounded-xl group-hover:scale-110 transition-transform`}>
                        <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Add an image</p>
                        <p className="text-gray-400 text-sm">Click to upload (max 5MB)</p>
                      </div>
                    </div>
                  </button>
                )}
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <span className="text-amber-400 text-xl">🔒</span>
                  <div className="flex-1">
                    <p className="text-amber-200 text-sm font-medium mb-1">
                      Your Privacy Matters
                    </p>
                    <p className="text-amber-200/70 text-xs">
                      Your post will be shared anonymously using your pseudonymous username.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || uploading || (!content.trim() && !selectedImage)}
                className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading || uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {uploading ? 'Uploading...' : 'Posting...'}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Share Post
                  </>
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
