'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { Button } from '@/app/components/ui/Button';
import { Textarea } from '@/app/components/ui/TextArea';
import { commentsAPI } from '@/app/utils/api';
import toast from 'react-hot-toast';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onCommentAdded: () => void;
  placeholder?: string;
  buttonText?: string;
}

interface CommentFormData {
  content: string;
}

export default function CommentForm({ 
  postId, 
  parentId, 
  onCommentAdded, 
  placeholder = "Write a comment...",
  buttonText = "Post Comment"
}: CommentFormProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CommentFormData>();

  const onSubmit = async (data: CommentFormData) => {
    if (!session) {
      toast.error('Please sign in to comment');
      return;
    }

    setLoading(true);
    try {
      await commentsAPI.createComment({
        postId: postId,
        content: data.content,
        parentId: parentId || null
      });
      
      reset();
      onCommentAdded();
      toast.success('Comment added successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-3 sm:py-4">
        <p className="text-gray-500 text-xs sm:text-sm">Please sign in to comment</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 sm:space-y-3">
      <Textarea
        {...register('content', { required: 'Comment cannot be empty' })}
        placeholder={placeholder}
        className={`min-h-[60px] sm:min-h-[70px] lg:min-h-[80px] text-sm sm:text-base ${errors.content ? 'border-red-500' : ''}`}
      />
      {errors.content && (
        <p className="text-red-500 text-xs sm:text-sm">{errors.content.message}</p>
      )}
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={loading} 
          size="sm"
          className="w-full sm:w-auto text-xs sm:text-sm px-4 sm:px-6"
        >
          {loading ? 'Posting...' : buttonText}
        </Button>
      </div>
    </form>
  );
}