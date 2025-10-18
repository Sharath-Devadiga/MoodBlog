import { create } from 'zustand';

interface PostState {
  selectedPostId: number | null;
  setSelectedPostId: (id: number | null) => void;
}

export const usePostStore = create<PostState>((set) => ({
  selectedPostId: null,
  setSelectedPostId: (id: number | null) => set(() => ({ selectedPostId: id })),
}));
