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
  onUpdate: () => void;
  depth?: number;
}

export default function CommentItem({ comment, postId, onUpdate, depth = 0 }: CommentItemProps) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(true); 
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const isOwner = session?.user?.id === comment.user.id.toString();
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
      await commentsAPI.updateComment(comment.id, {
        content: editContent
      });
      
      setIsEditing(false);
      onUpdate();
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
      onUpdate();
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
    onUpdate();
  };

  return (
    <>
      <div className={`${depth > 0 ? 'ml-8 pl-4 border-l-2 border-white/10' : ''}`}>
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Avatar 
                username={comment.user.publicUsername}
                animalId={comment.user.avatarId}
                colorIndex={comment.user.colorIndex}
                size="sm"
              />
              <div>
                <span className="font-medium text-sm text-white">{comment.user.publicUsername}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            {isOwner && !isEditing && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="h-8 w-8 p-0 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
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
                className="min-h-[60px]"
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleEdit} disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              <p className="text-gray-200 mb-2 text-sm leading-relaxed">{comment.content}</p>
              
              <div className="flex items-center space-x-4">
                {depth < maxDepth && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-xs text-gray-400 hover:text-white h-auto p-0"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}

                
                {hasReplies && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplies(!showReplies)}
                    className="text-xs text-gray-400 hover:text-white h-auto p-0 flex items-center"
                  >
                    {showReplies ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Hide {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        View {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
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
                  onCommentAdded={handleReplyAdded}
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
                  onUpdate={onUpdate}
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