'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { postsAPI } from '@/app/utils/api';
import { MOODS } from '@/app/utils/constants';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: {
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
    _count?: {
      comments: number;
    };
  };
  onDelete?: () => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(post._count?.comments || 0);
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const isOwner = session?.user?.id && post.user?.id && 
                  (session.user as any).id === post.user.id.toString();
                  
  const moodConfig = MOODS.find(m => m.value === post.mood);

  useEffect(() => {
    fetchLikeData();
    fetchCommentCount();
  }, [post.id]);

  const fetchLikeData = async () => {
    try {
      const [likeStatusRes, likeCountRes] = await Promise.all([
        postsAPI.getLikeStatus(post.id.toString()),
        postsAPI.getLikeCount(post.id.toString())
      ]);
      setLiked(likeStatusRes.data.liked);
      setLikeCount(likeCountRes.data.count);
    } catch (error) {
      console.error('Error fetching like data:', error);
    }
  };

  const fetchCommentCount = async () => {
    try {
      const response = await postsAPI.getCommentCount(post.id.toString());
      setCommentCount(response.data.count);
    } catch (error) {
      console.error('Error fetching comment count:', error);
    }
  };

  const handleLike = async () => {
    setLoading(true);
    try {
      const response = await postsAPI.toggleLike(post.id.toString());
      setLiked(response.data.liked);
      setLikeCount(prev => response.data.liked ? prev + 1 : prev - 1);
    } catch (error) {
      toast.error('Failed to update like');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await postsAPI.deletePost(post.id.toString());
      toast.success('Post deleted successfully');
      onDelete?.();
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              {post.user.avatar ? (
                <img
                  src={post.user.avatar}
                  alt={post.user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium">
                  {post.user.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <Link 
                href={`/profile/${post.user.id}`}
                className="font-semibold hover:underline"
              >
                {post.user.username}
              </Link>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {moodConfig && (
              <span className={`px-3 py-1 text-xs rounded-full mood-${moodConfig.value}`}>
                {moodConfig.label}
              </span>
            )}
            
            {isOwner && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowActions(!showActions)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                
                {showActions && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10">
                    <Link href={`/posts/${post.id}/edit`}>
                      <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Link href={`/posts/${post.id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 cursor-pointer">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-700 mb-4 line-clamp-3">
          {post.content}
        </p>

        {post.image && (
          <div className="mb-4">
            <img
              src={post.image}
              alt="Post image"
              className="w-full max-h-96 object-cover rounded-md"
            />
          </div>
        )}

        <div className="flex items-center space-x-4 pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={loading}
            className={liked ? 'text-red-500' : ''}
          >
            <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
            {likeCount}
          </Button>

          {/* Updated: Direct link to comments page */}
          <Link href={`/posts/${post.id}/comments`}>
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4 mr-1" />
              {commentCount > 0 ? commentCount : 'Comments'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}