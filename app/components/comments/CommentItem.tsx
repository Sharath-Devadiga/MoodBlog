'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { Edit, Trash2, Reply, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui/Button';
import { Textarea } from '@/app/components/ui/TextArea';
import ConfirmDialog from '@/app/components/ui/ConfirmDialog';
import Avatar from '@/app/components/ui/Avatar';
import CommentForm from './CommentForm';
import { commentsAPI } from '@/app/utils/api';
import { useCommentStore } from '@/app/store/commentStore';
import toast from 'react-hot-toast';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    publicUsername: string;
    avatarId?: string;
    colorIndex?: number;
  };
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  postId: string;
  depth?: number;
}

export default function CommentItem({ comment, postId, depth = 0 }: CommentItemProps) {
  const { data: session } = useSession();
  const { updateComment, removeComment } = useCommentStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(true); 
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editContent, setEditContent] = useState(comment?.content || '');
  const [loading, setLoading] = useState(false);

  if (!comment || !comment.user) {
    return null;
  }

  const isOwner = (session?.user as any)?.id === comment.user.id.toString();
  const maxDepth = 3; 
  const hasReplies = comment.replies && comment.replies.length > 0;
  const replyCount = comment.replies?.length || 0;

  const handleEdit = async () => {
    if (!editContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const { data } = await commentsAPI.updateComment(comment.id, {
        content: editContent
      });
      
      updateComment(postId, comment.id, data.comment.content);
      setIsEditing(false);
      toast.success('Comment updated');
    } catch (error) {
      toast.error('Failed to update comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await commentsAPI.deleteComment(comment.id);
      removeComment(postId, comment.id);
      toast.success('Comment deleted');
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error('Failed to delete comment');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyAdded = () => {
    setIsReplying(false);
  };

  return (
    <>
      <div className={`${depth > 0 ? 'ml-4 sm:ml-6 lg:ml-8 pl-2 sm:pl-3 lg:pl-4 border-l-2 border-white/10' : ''}`}>
        <div className="mb-3 sm:mb-4">
          <div className="flex items-start justify-between mb-2 gap-2">
            <div className="flex items-start gap-2 sm:gap-2.5 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <Avatar 
                  username={comment.user.publicUsername}
                  animalId={comment.user.avatarId}
                  colorIndex={comment.user.colorIndex}
                  size="sm"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                  <span className="font-medium text-xs sm:text-sm text-white truncate">{comment.user.publicUsername}</span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>

            {isOwner && !isEditing && (
              <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                >
                  <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:text-red-400"
                >
                  <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px] text-sm sm:text-base"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleEdit} disabled={loading} className="text-xs sm:text-sm">
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="text-xs sm:text-sm"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              <p className="text-gray-200 mb-2 text-xs sm:text-sm leading-relaxed break-words">{comment.content}</p>
              
              <div className="flex items-center gap-3 sm:gap-4">
                {depth < maxDepth && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-xs text-gray-400 hover:text-white h-auto p-0 flex items-center gap-1"
                  >
                    <Reply className="h-3 w-3" />
                    <span>Reply</span>
                  </Button>
                )}

                
                {hasReplies && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplies(!showReplies)}
                    className="text-xs text-gray-400 hover:text-white h-auto p-0 flex items-center gap-1"
                  >
                    {showReplies ? (
                      <>
                        <ChevronUp className="h-3 w-3" />
                        <span className="hidden xs:inline">Hide </span>{replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3" />
                        <span className="hidden xs:inline">View </span>{replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </>
          )}

          
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3"
              >
                <CommentForm
                  postId={postId}
                  parentId={comment.id}
                  placeholder="Write a reply..."
                  buttonText="Reply"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        
        <AnimatePresence>
          {hasReplies && showReplies && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {comment.replies!.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  depth={depth + 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={loading}
      />
    </>
  );
}