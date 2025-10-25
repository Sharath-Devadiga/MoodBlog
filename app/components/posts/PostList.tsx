'use client';

import { useEffect, useRef } from 'react';
import PostCard from './PostCard';
import { postsAPI } from '@/app/utils/api';
import { usePostStore } from '@/app/store/postStore';
import toast from 'react-hot-toast';

interface Post {
  id: string;
  title?: string | null;
  content?: string | null;
  mood: string;
  imageUrl?: string | null;
  createdAt: string;
  user: {
    id: string;
    publicUsername: string | null;
    avatarId?: string;
    colorIndex?: number;
  };
  _count?: {
    likes: number;
    comments: number;
  };
  isLikedByUser?: boolean;
}

interface PostListProps {
  mood?: string;
}

export default function PostList({ mood }: PostListProps) {
  const { posts, setPosts, removePost, loading, setLoading } = usePostStore();
  const lastFetchedMood = useRef<string | undefined | null>(null);
  const hasInitialized = useRef(false);

  const filteredPosts = mood 
    ? posts.filter(post => post.mood === mood)
    : posts;

  useEffect(() => {
    if (!hasInitialized.current || lastFetchedMood.current !== mood) {
      hasInitialized.current = true;
      lastFetchedMood.current = mood;
      fetchPosts();
    }
  }, [mood]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = mood 
        ? await postsAPI.getPostsByMood(mood)
        : await postsAPI.getAllPosts();
      
      setPosts(response.data.posts || response.data);
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostDelete = (postId: string) => {
    removePost(postId);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <p className="text-gray-400 text-sm sm:text-base">
          {mood ? `No posts found for ${mood} mood` : 'No posts found'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6 pb-6 sm:pb-8 min-h-[60vh]">
      {filteredPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={() => handlePostDelete(post.id)}
        />
      ))}
    </div>
  );
}