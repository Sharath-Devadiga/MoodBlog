'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Card className="mb-4 md:mb-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="px-3 py-4 md:px-6 md:py-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 md:space-x-3">
              <motion.div whileHover={{ scale: 1.08 }} className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
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
              </motion.div>
              <div>
                <div className="flex flex-col">
                  <Link 
                    href={`/profile/${post.user.id}`}
                    className="font-semibold hover:underline text-sm md:text-base"
                  >
                    {post.user.username}
                  </Link>
                  <p className="text-xs md:text-sm text-gray-500">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {moodConfig && (
                <motion.span
                  className={`px-3 py-1 text-xs rounded-full mood-${moodConfig.value}`}
                  initial={{ scale: 0.9, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {moodConfig.label}
                </motion.span>
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
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10"
                    >
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
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-3 py-4 md:px-6 md:py-6">
          <Link href={`/posts/${post.id}`}>
            <motion.h3
              className="text-lg md:text-xl font-semibold mb-2 hover:text-blue-600 cursor-pointer"
              whileHover={{ scale: 1.02, color: '#2563eb' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {post.title}
            </motion.h3>
          </Link>
          <motion.p 
            className="text-sm md:text-base text-gray-700 mb-4 line-clamp-3" 
            initial={{ opacity: 0.8 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.4 }}
          >
            {post.content}
          </motion.p>

          {post.image && (
            <motion.div 
              className="mb-4 -mx-3 md:mx-0" 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5 }}
            >
              <img
                src={post.image}
                alt="Post image"
                className="w-full max-h-[200px] md:max-h-[400px] object-cover md:rounded-md"
              />
            </motion.div>
          )}

          <div className="flex items-center justify-between md:justify-start md:space-x-4 pt-4 border-t">
            <motion.div whileTap={{ scale: 0.92 }} className="flex-1 md:flex-none">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={loading}
                className={`w-full md:w-auto ${liked ? 'text-red-500' : ''}`}
              >
                <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                <span className="text-sm">{likeCount}</span>
              </Button>
            </motion.div>
            <Link href={`/posts/${post.id}/comments`} className="flex-1 md:flex-none">
              <motion.div whileTap={{ scale: 0.96 }} className="w-full">
                <Button variant="ghost" size="sm" className="w-full md:w-auto">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">{commentCount > 0 ? commentCount : 'Comments'}</span>
                </Button>
              </motion.div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}