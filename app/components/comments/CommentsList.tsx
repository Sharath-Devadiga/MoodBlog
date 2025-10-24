'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { commentsAPI } from '@/app/utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { MessageCircle } from 'lucide-react';
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

interface CommentListProps {
  postId: string;
  showFullComments?: boolean; 
  maxComments?: number; 
}

export default function CommentList({ 
  postId, 
  showFullComments = false, 
  maxComments = 3 
}: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.getComments(postId);
      setComments(response.data.comments);
    } catch (error) {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllComments = () => {
    router.push(`/posts/${postId}/comments`);
  };

  if (loading) {
    return (
      <Card className="bg-zinc-900 border-white/10">
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayedComments = showFullComments ? comments : comments.slice(0, maxComments);
  const hasMoreComments = comments.length > maxComments && !showFullComments;

  return (
    <Card className="bg-zinc-900 border-white/10">
      <CardHeader 
        className="cursor-pointer p-4 md:p-6" 
        onClick={!showFullComments ? handleViewAllComments : undefined}
      >
        <CardTitle className={`flex items-center gap-2 text-base md:text-lg text-white ${!showFullComments ? 'hover:text-orange-400 transition-colors' : ''}`}>
          <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4 md:space-y-6">
          {showFullComments && (
            <CommentForm
              postId={postId}
              onCommentAdded={fetchComments}
            />
          )}
          
          {displayedComments.length > 0 ? (
            <div className="space-y-4">
              {displayedComments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  postId={postId}
                  onUpdate={fetchComments}
                />
              ))}
              
              {hasMoreComments && (
                <div className="text-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleViewAllComments}
                    className="w-full border-white/10 text-gray-300 hover:bg-zinc-800"
                  >
                    View all {comments.length} comments
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-3">
                No comments yet. Be the first to comment!
              </p>
              {!showFullComments && (
                <Button 
                  variant="outline" 
                  onClick={handleViewAllComments}
                  size="sm"
                  className="border-white/10 text-gray-300 hover:bg-zinc-800"
                >
                  Add Comment
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}