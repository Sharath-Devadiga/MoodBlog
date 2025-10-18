import { NextRequest, NextResponse } from "next/server";
import { validatePostId } from "@/app/lib/utils/validation";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { postId, error: validationError } = validatePostId(context.params.id);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
        parentId: null, 
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}