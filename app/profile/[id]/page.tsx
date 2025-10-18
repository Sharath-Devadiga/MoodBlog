'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { Skeleton } from '@/app/components/ui/Skeleton';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  mood: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

interface UserProfile {
  username: string;
  bio?: string;
  avatar?: string;
  posts: Post[];
}

export default function UserProfilePage() {
  const { id } = useParams();
  console.log("🔍 profile page param id:", id);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-20 w-full mb-4" />
        <Skeleton className="h-40 w-full mb-4" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10 text-gray-500">
        User not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center space-x-4 mb-8">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={60}
            height={60}
            className="rounded-full"
          />
        ) : (
          <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center text-xl">
            {user.username[0].toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold">{user.username}</h1>
          {user.bio && <p className="text-gray-600">{user.bio}</p>}
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Posts</h2>
      {user.posts.length === 0 ? (
        <p className="text-gray-500">This user has no posts yet.</p>
      ) : (
        user.posts.map((post) => (
          <Card key={post.id} className="mb-6">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{post.content}</p>
              <p className="text-sm text-gray-600 mb-2">Mood: {post.mood}</p>
              {post.image && (
                <Image
                  src={post.image}
                  alt="Post Image"
                  width={600}
                  height={300}
                  className="rounded-lg object-cover"
                />
              )}
              {post.comments.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Comments</h4>
                  <div className="space-y-2">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="text-sm text-gray-800 border-l-2 pl-2">
                        <strong>{comment.user.username}</strong>: {comment.content}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
