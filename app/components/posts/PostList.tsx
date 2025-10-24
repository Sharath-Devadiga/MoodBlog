'use client';

import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { postsAPI } from '@/app/utils/api';
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [mood]);

  const fetchPosts = async () => {
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
    setPosts(posts.filter(post => post.id !== postId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 md:py-16">
        <div className="w-10 h-10 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 md:py-16">
        <p className="text-gray-400 text-sm md:text-base">
          {mood ? `No posts found for ${mood} mood` : 'No posts found'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 pb-8">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={() => handlePostDelete(post.id)}
        />
      ))}
    </div>
  );
}