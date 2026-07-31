interface Post {
  id: string;
  createdAt: Date;
  userId: string;
  likes: { userId: string }[];
  comments: { userId: string }[];
  _count: {
    likes: number;
    comments: number;
  };
}

interface RankedPost {
  id: string;
  content: string | null;
  imageUrl: string | null;
  mood: string | null;
  createdAt: Date;
  user: {
    id: string;
    publicUsername: string | null;
    avatarId: string | null;
    colorIndex: number | null;
  };
  likeCount: number;
  commentCount: number;
  isLikedByUser: boolean;
  _count: {
    likes: number;
    comments: number;
  };
}

export function rankPosts(
  posts: any[],
  userId: string | undefined,
  viewedPosts: Set<string>
): RankedPost[] {
  const postsWithScore = posts.map(post => {
    const ageInHours = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
    
    const recencyScore = Math.max(0, 10 - ageInHours);
    
    const likesCount = post._count.likes;
    const commentsCount = post._count.comments;
    const engagementScore = Math.log10(likesCount * 2 + 1) * 0.5 + Math.log10(commentsCount * 3 + 1) * 0.5;
    
    let interactionPenalty = 1.0;
    
    if (userId) {
      const userHasLiked = post.likes.some((like: { userId: string }) => like.userId === userId);
      const userHasCommented = post.comments.some((comment: { userId: string }) => comment.userId === userId);
      const userHasViewed = viewedPosts.has(post.id);
      
      if (userHasLiked || userHasCommented) {
        interactionPenalty = 0.05;
      } else if (userHasViewed) {
        interactionPenalty = 0.2;
      }
    }
    
    const affinityScore = userId && post.userId === userId ? 0.5 : 1.0;
    
    const explorationBonus = Math.random() * 5;
    
    const finalScore = 
      (recencyScore * 1 + 
       engagementScore * 0.2 + 
       affinityScore * 0.1) * 
      interactionPenalty + 
      explorationBonus;

    return {
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      mood: post.mood,
      createdAt: post.createdAt,
      user: post.user,
      likeCount: likesCount,
      commentCount: commentsCount,
      isLikedByUser: userId ? post.likes.some((like: { userId: string }) => like.userId === userId) : false,
      _count: {
        likes: likesCount,
        comments: commentsCount
      },
      finalScore
    };
  });

  const sortedPosts = postsWithScore.sort((a, b) => b.finalScore - a.finalScore);

  return sortedPosts.slice(0, 30).map(({ finalScore, ...post }) => post);
}
