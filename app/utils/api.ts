import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

interface PostData {
  content?: string;
  imageUrl?: string | null;
  mood: string;
}

interface CommentData {
  postId: string;
  content: string;
  parentId?: string | null;
}

export const authAPI = {
  signup: (data: { email: string; password: string }) =>
    api.post('/register/signup', data),
  signin: (data: { email: string; password: string }) =>
    api.post('/auth', data),
  createProfile: (data: { publicUsername: string }) =>
    api.put('/auth/create-profile', data),
};

export const postsAPI = {
  getAllPosts: () => api.get('/posts'),
  getPost: (id: string) => api.get(`/posts/${id}`),
  createPost: (data: PostData) => api.post('/posts', data),
  updatePost: (id: string, data: PostData) => api.put(`/posts/${id}`, data),
  deletePost: (id: string) => api.delete(`/posts/${id}`),
  getPostsByMood: (mood: string) => api.get(`/posts/mood/${mood}`),
  toggleLike: (id: string) => api.post(`/posts/${id}/like`),
  getLikeStatus: (id: string) => api.get(`/posts/${id}/like?user=true`),
  getLikeCount: (id: string) => api.get(`/posts/${id}/like`),
  getCommentCount: (id: string) => api.get(`/posts/${id}/comments/count`),

};

export const commentsAPI = {
  getComments: (postId: string) => api.get(`/posts/${postId}/comments`),
  createComment: (data: CommentData) => api.post('/comments', data),
  updateComment: (id: string, data: Partial<CommentData>) => api.put(`/comments/${id}`, data),
  deleteComment: (id: string) => api.delete(`/comments/${id}`),
};

export const usersAPI = {
  getUser: (id: string) => api.get(`/users/${id}`),
};