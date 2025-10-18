'use client';

import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { postsAPI } from '@/app/utils/api';
import toast from 'react-hot-toast';

interface Post {
  id: number;
  title: string;
  content: string;
  mood: string;
  image?: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    avatar?: string;
  };
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

  const handlePostDelete = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {mood ? `No posts found for ${mood} mood` : 'No posts found'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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