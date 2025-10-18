'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Textarea } from '@/app/components/ui/TextArea';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { postsAPI } from '@/app/utils/api';
import { MOODS } from '@/app/utils/constants';
import { Upload } from 'lucide-react';

interface PostFormData {
  title: string;
  content: string;
  mood: string;
  image?: string;
}

interface PostFormProps {
  mode?: 'create' | 'edit';
  postId?: string;
  initialData?: PostFormData;
}

export default function PostForm({ mode = 'create', postId, initialData }: PostFormProps) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PostFormData>({
    defaultValues: initialData
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setValue('image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: PostFormData) => {
    setLoading(true);
    try {
      if (mode === 'create') {
        await postsAPI.createPost(data);
        toast.success('Post created successfully!');
        router.push('/dashboard');
      } else if (mode === 'edit' && postId) {
        await postsAPI.updatePost(postId, data);
        toast.success('Post updated successfully!');
        router.push(`/posts/${postId}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === 'create' ? 'Create New Post' : 'Edit Post'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                {...register('title', { required: 'Title is required' })}
                placeholder="What's on your mind?"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                {...register('content', { required: 'Content is required' })}
                placeholder="Share your thoughts..."
                className={`min-h-[200px] ${errors.content ? 'border-red-500' : ''}`}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mood</label>
              <select
                {...register('mood', { required: 'Please select a mood' })}
                className={`w-full h-10 px-3 py-2 border rounded-md bg-background ${
                  errors.mood ? 'border-red-500' : 'border-input'
                }`}
              >
                <option value="">Select your mood</option>
                {MOODS.map((mood) => (
                  <option key={mood.value} value={mood.value}>
                    {mood.label}
                  </option>
                ))}
              </select>
              {errors.mood && (
                <p className="text-red-500 text-sm mt-1">{errors.mood.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image (optional)</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Image</span>
                </label>
              </div>
              
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-w-md h-48 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : mode === 'create' ? 'Create Post' : 'Update Post'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}