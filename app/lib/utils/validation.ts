export function validatePostId(id: string) {
  const postId = parseInt(id);
  if (isNaN(postId)) {
    return { error: "Invalid post ID" };
  }
  return { postId };
}

export function validateUserId(id: string) {
  const userId = parseInt(id);
  if (isNaN(userId)) {
    return { error: "Invalid user ID" };
  }
  return { userId };
}

export function validateCommentId(id: string) {
  const commentId = parseInt(id);
  if (isNaN(commentId)) {
    return { error: "Invalid comment ID" };
  }
  return { commentId };
}

