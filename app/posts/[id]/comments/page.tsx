'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import CommentList from '@/app/components/comments/CommentsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { postsAPI } from '@/app/utils/api';
import { Skeleton } from '@/app/components/ui/Skeleton';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { MOODS } from '@/app/utils/constants';

interface Post {
  id: string;
  content?: string | null;
  imageUrl?: string | null;
  mood: string;
  createdAt: string;
  user: {
    id: string;
    publicUsername: string;
    avatarId?: string;
    colorIndex?: number;
  };
}

export default function CommentsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await postsAPI.getPost(id as string);
        setPost(response.data.post);
      } catch (error) {
        toast.error('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const moodConfig = post ? MOODS.find(m => m.value === post.mood) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <Skeleton className="h-10 w-32 mb-4 bg-zinc-800" />
            <Skeleton className="h-8 w-3/4 mb-2 bg-zinc-800" />
            <Skeleton className="h-20 w-full bg-zinc-800" />
          </div>
          <Skeleton className="h-40 w-full bg-zinc-800" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold text-white mb-4">Post not found</h2>
            <Button onClick={() => router.back()} className="bg-gradient-to-r from-orange-500 to-rose-500 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto p-3 sm:p-4 lg:p-6">
        
        <div className="mb-4 sm:mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-3 sm:mb-4 text-gray-300 hover:text-white text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Feed
          </Button>
        </div>

        
        <Card className="mb-4 sm:mb-6 bg-zinc-900 border-white/10">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-start sm:items-center justify-between gap-2">
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs sm:text-sm font-medium text-white">
                    {post.user.publicUsername.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white text-sm sm:text-base truncate">{post.user.publicUsername}</p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              {moodConfig && (
                <span className={`px-2 sm:px-3 py-1 text-xs rounded-full mood-${moodConfig.value} flex-shrink-0`}>
                  {moodConfig.label}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            {post.content && (
              <p className="text-gray-200 mb-3 text-xs sm:text-sm lg:text-base leading-relaxed break-words">{post.content}</p>
            )}
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post image"
                className="w-full max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] object-contain rounded-md bg-zinc-800/50"
              />
            )}
          </CardContent>
        </Card>

        
        <CommentList postId={id as string} showFullComments={true} />
      </div>
    </div>
  );
}