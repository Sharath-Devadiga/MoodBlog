'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import CommentList from '@/app/components/comments/CommentsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card';
import axios from 'axios';
import { Skeleton } from '@/app/components/ui/Skeleton';

interface Post {
  id: string;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
  };
}

export default function CommentsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${id}`);
        setPost(response.data.post);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Post not found</h2>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Post
        </Button>
      </div>

      {/* Post Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <p className="text-sm text-gray-500">
            by {post.user.username} • {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-2">{post.content}</p>
          <p className="text-sm text-gray-600">Mood: {post.mood}</p>
        </CardContent>
      </Card>

      {/* Comments */}
      <CommentList postId={id as string} showFullComments={true} />
    </div>
  );
}