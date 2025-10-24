'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import ConfirmDialog from '@/app/components/ui/ConfirmDialog';
import Avatar from '@/app/components/ui/Avatar';
import { postsAPI } from '@/app/utils/api';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: {
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
      comments: number;
      likes: number;
    };
    isLikedByUser?: boolean;
  };
  onDelete?: () => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(post.isLikedByUser || false);
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0);
  const [commentCount, setCommentCount] = useState(post._count?.comments || 0);
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = (session?.user as any)?.id && post.user?.id && 
                  (session?.user as any).id === post.user.id.toString();

  const handleLike = async () => {
    if (!session?.user) {
      toast.error('Please sign in to like posts');
      return;
    }

    if (loading) return;

    const previousLiked = liked;
    const previousCount = likeCount;
    
    const willBeLiked = !liked;
    
    setLiked(willBeLiked);
    setLikeCount(willBeLiked ? likeCount + 1 : likeCount - 1);
    setLoading(true);

    try {
      const response = await postsAPI.toggleLike(post.id);
      setLiked(response.data.liked);
    } catch (error) {
      setLiked(previousLiked);
      setLikeCount(previousCount);
      toast.error('Failed to update like');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await postsAPI.deletePost(post.id);
      toast.success('Post deleted successfully');
      setShowDeleteDialog(false);
      onDelete?.();
    } catch (error) {
      toast.error('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-3xl mx-auto"
    >
      <Card className="bg-zinc-900 border-white/10 shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300 overflow-hidden">
        
        <CardHeader className="p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 md:gap-3">
              <Link href={`/profile/${post.user.id}`}>
                <Avatar 
                  username={post.user.publicUsername}
                  animalId={post.user.avatarId}
                  colorIndex={post.user.colorIndex}
                  size="md" 
                />
              </Link>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link 
                    href={`/profile/${post.user.id}`}
                    className="font-semibold hover:underline text-sm md:text-base text-white truncate"
                  >
                    {post.user.publicUsername || 'Anonymous'}
                  </Link>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            
            {isOwner && (
              <div className="relative flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowActions(!showActions)}
                  className="h-8 w-8 p-0 hover:bg-white/10"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                <AnimatePresence>
                  {showActions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-10 bg-zinc-800 border border-white/10 rounded-lg shadow-2xl py-1 z-10 min-w-[140px]"
                    >
                      <Link href={`/posts/${post.id}/edit`}>
                        <button className="flex items-center w-full px-4 py-2.5 text-sm text-gray-200 hover:bg-zinc-700 transition-colors">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          setShowActions(false);
                          setShowDeleteDialog(true);
                        }}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </CardHeader>

        
        <CardContent className="p-4 md:p-5 pt-0">
          {post.content && (
            <motion.div
              initial={{ opacity: 0.8 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <p className="text-sm md:text-base text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
                {post.content}
              </p>
            </motion.div>
          )}

          {post.imageUrl && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.4 }}
              className="mb-4 rounded-lg overflow-hidden bg-zinc-800"
            >
              <img
                src={post.imageUrl}
                alt="Post image"
                className="w-full h-auto max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-cover"
              />
            </motion.div>
          )}

          
          <div className="flex items-center gap-2 pt-3 border-t border-white/10">
            <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={loading}
                className={`w-full h-10 md:h-9 justify-center gap-2 ${
                  liked ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Heart className={`h-4 w-4 md:h-5 md:w-5 ${liked ? 'fill-current' : ''}`} />
                <span className="text-sm md:text-base font-medium">{likeCount}</span>
              </Button>
            </motion.div>
            
            <Link href={`/posts/${post.id}/comments`} className="flex-1">
              <motion.div whileTap={{ scale: 0.95 }} className="w-full">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full h-10 md:h-9 justify-center gap-2 text-gray-400 hover:text-white"
                >
                  <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-sm md:text-base font-medium">{commentCount > 0 ? commentCount : 'Comment'}</span>
                </Button>
              </motion.div>
            </Link>
          </div>
        </CardContent>
      </Card>

      
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone and will also delete all comments."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleting}
      />
    </motion.div>
  );
}