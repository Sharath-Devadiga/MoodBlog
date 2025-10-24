import { NextRequest, NextResponse } from "next/server";
import { validatePostId } from "@/app/lib/utils/validation";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const { postId, error: validationError } = validatePostId(params.id);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    
    const allComments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            publicUsername: true,
            avatarId: true,
            colorIndex: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    
    const commentMap = new Map();
    const rootComments: any[] = [];

    
    allComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    
    allComments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id);
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        } else {
          rootComments.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return NextResponse.json({ comments: rootComments });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}