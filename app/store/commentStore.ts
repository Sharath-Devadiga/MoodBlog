import { create } from 'zustand';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  postId: string;
  parentId: string | null;
  user: {
    id: string;
    publicUsername: string;
    avatarId?: number;
  };
  replies?: Comment[];
}

interface CommentState {
  comments: Record<string, Comment[]>; 
  activeCommentId: string | null;
  editingCommentId: string | null;
  replyingToCommentId: string | null;
  loading: boolean;
  
  setComments: (postId: string, comments: Comment[]) => void;
  addComment: (postId: string, comment: Comment) => void;
  updateComment: (postId: string, commentId: string, content: string) => void;
  removeComment: (postId: string, commentId: string) => void;
  setActiveCommentId: (id: string | null) => void;
  setEditingCommentId: (id: string | null) => void;
  setReplyingToCommentId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  getPostComments: (postId: string) => Comment[];
  buildCommentTree: (postId: string) => Comment[];
}

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: {},
  activeCommentId: null,
  editingCommentId: null,
  replyingToCommentId: null,
  loading: false,
  
  setComments: (postId, comments) => set((state) => ({
    comments: { ...state.comments, [postId]: comments },
  })),
  
  addComment: (postId, comment) => set((state) => {
    const existingComments = state.comments[postId] || [];
    return {
      comments: {
        ...state.comments,
        [postId]: [...existingComments, comment],
      },
    };
  }),
  
  updateComment: (postId, commentId, content) => set((state) => {
    const postComments = state.comments[postId] || [];
    return {
      comments: {
        ...state.comments,
        [postId]: postComments.map((comment) =>
          comment.id === commentId ? { ...comment, content } : comment
        ),
      },
    };
  }),
  
  removeComment: (postId, commentId) => set((state) => {
    const postComments = state.comments[postId] || [];
    return {
      comments: {
        ...state.comments,
        [postId]: postComments.filter((comment) => comment.id !== commentId),
      },
    };
  }),
  
  setActiveCommentId: (id) => set({ activeCommentId: id }),
  setEditingCommentId: (id) => set({ editingCommentId: id }),
  setReplyingToCommentId: (id) => set({ replyingToCommentId: id }),
  setLoading: (loading) => set({ loading }),
  
  getPostComments: (postId) => {
    return get().comments[postId] || [];
  },
  
  buildCommentTree: (postId) => {
    const allComments = get().comments[postId] || [];
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];
    
    
    allComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });
    
    
    allComments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id)!;
      
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentWithReplies);
        } else {
          rootComments.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });
    
    return rootComments;
  },
}));
