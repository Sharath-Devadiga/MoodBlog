export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  mood: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user: {
    username: string;
    avatar?: string;
  };
}

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  parentId?: number;
  userId: number;
  postId: number;
  user: {
    id: number;
    username: string;
    avatar?: string;
  };
  replies?: Comment[];
}

export interface Like {
  userId: number;
  postId: number;
  user: {
    id: number;
    username: string;
    avatar?: string;
  };
}