export function validatePostId(id: string) {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return { error: "Invalid post ID" };
  }
  return { postId: id };
}

export function validateUserId(id: string) {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return { error: "Invalid user ID" };
  }
  return { userId: id };
}

export function validateCommentId(id: string) {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return { error: "Invalid comment ID" };
  }
  return { commentId: id };
}

