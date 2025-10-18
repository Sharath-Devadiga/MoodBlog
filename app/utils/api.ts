import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const authAPI = {
  signup: (data: { email: string; username: string; password: string }) =>
    api.post('/register/signup', data),
  signin: (data: { email: string; password: string }) =>
    api.post('/auth', data),
};

export const postsAPI = {
  getAllPosts: () => api.get('/posts'),
  getPost: (id: string) => api.get(`/posts/${id}`),
  createPost: (data: any) => api.post('/posts', data),
  updatePost: (id: string, data: any) => api.put(`/posts/${id}`, data),
  deletePost: (id: string) => api.delete(`/posts/${id}`),
  getPostsByMood: (mood: string) => api.get(`/posts/mood/${mood}`),
  toggleLike: (id: string) => api.post(`/posts/${id}/like`),
  getLikeStatus: (id: string) => api.get(`/posts/${id}/like?user=true`),
  getLikeCount: (id: string) => api.get(`/posts/${id}/like`),
  getCommentCount: (id: string) => api.get(`/posts/${id}/comments/count`),

};

export const commentsAPI = {
  getComments: (postId: string) => api.get(`/posts/${postId}/comments`),
  createComment: (data: any) => api.post('/comments', data),
  updateComment: (id: string, data: any) => api.put(`/comments/${id}`, data),
  deleteComment: (id: string) => api.delete(`/comments/${id}`),
};

export const usersAPI = {
  getUser: (id: string) => api.get(`/users/${id}`),
};