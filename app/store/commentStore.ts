import { create } from 'zustand';

interface CommentState {
  activeCommentId: number | null;
  setActiveCommentId: (id: number | null) => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  activeCommentId: null,
  setActiveCommentId: (id: number | null) => set(() => ({ activeCommentId: id })),
}));
