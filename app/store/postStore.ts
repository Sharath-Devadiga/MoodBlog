import { create } from 'zustand';

interface Post {
  id: string;
  content?: string | null;
  imageUrl?: string | null;
  mood: string;
  createdAt: string;
  user: {
    id: string;
    publicUsername: string;
    avatarId?: string;
    colorIndex?: number;
  };
  _count?: {
    likes: number;
    comments: number;
  };
  isLikedByUser?: boolean;
}

interface PostState {
  posts: Post[];
  selectedPostId: string | null;
  loading: boolean;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  removePost: (id: string) => void;
  setSelectedPostId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  updateLikeCount: (postId: string, increment: boolean) => void;
  updateCommentCount: (postId: string, count: number) => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  selectedPostId: null,
  loading: false,
  
  setPosts: (posts) => set({ posts }),
  
  addPost: (post) => set((state) => ({ 
    posts: [post, ...state.posts] 
  })),
  
  updatePost: (id, updates) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === id ? { ...post, ...updates } : post
    ),
  })),
  
  removePost: (id) => set((state) => ({
    posts: state.posts.filter((post) => post.id !== id),
  })),
  
  setSelectedPostId: (id) => set({ selectedPostId: id }),
  
  setLoading: (loading) => set({ loading }),
  
  updateLikeCount: (postId, increment) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            _count: {
              ...post._count,
              likes: (post._count?.likes || 0) + (increment ? 1 : -1),
              comments: post._count?.comments || 0,
            },
          }
        : post
    ),
  })),
  
  updateCommentCount: (postId, count) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            _count: {
              likes: post._count?.likes || 0,
              comments: count,
            },
          }
        : post
    ),
  })),
}));
