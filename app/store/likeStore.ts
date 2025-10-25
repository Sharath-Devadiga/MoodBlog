import { create } from 'zustand';

interface LikeState {
  likes: Record<string, { isLiked: boolean; count: number }>;
  
  setLike: (postId: string, isLiked: boolean, count: number) => void;
  toggleLike: (postId: string) => void;
  getLikeStatus: (postId: string) => { isLiked: boolean; count: number };
}

export const useLikeStore = create<LikeState>((set, get) => ({
  likes: {},
  
  setLike: (postId, isLiked, count) => set((state) => ({
    likes: {
      ...state.likes,
      [postId]: { isLiked, count },
    },
  })),
  
  toggleLike: (postId) => set((state) => {
    const current = state.likes[postId] || { isLiked: false, count: 0 };
    return {
      likes: {
        ...state.likes,
        [postId]: {
          isLiked: !current.isLiked,
          count: current.isLiked ? current.count - 1 : current.count + 1,
        },
      },
    };
  }),
  
  getLikeStatus: (postId) => {
    return get().likes[postId] || { isLiked: false, count: 0 };
  },
}));
