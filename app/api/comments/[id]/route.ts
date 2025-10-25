import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/utils/auth";
import { validateCommentId } from "@/app/lib/utils/validation";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { user, error } = await getAuthenticatedUser(req);
    if (error) return error;

    const params = await context.params;
    const { commentId, error: validationError } = validateCommentId(params.id);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const existing = await prisma.comment.findFirst({
      where: {
        id: commentId,
        userId: user!.id
      }
    });

    if (!existing) {
      return NextResponse.json({ error: "Comment not found or unauthorized" }, { status: 404 });
    }

    await prisma.comment.delete({
      where: { id: commentId }
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { user, error } = await getAuthenticatedUser(req);
    if (error) return error;

    const params = await context.params;
    const { commentId, error: validationError } = validateCommentId(params.id);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const body = await req.json();
    const { content } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Comment content cannot be empty" }, { status: 400 });
    }

    const existing = await prisma.comment.findFirst({
      where: {
        id: commentId,
        userId: user!.id
      }
    });

    if (!existing) {
      return NextResponse.json({ error: "Comment not found or unauthorized" }, { status: 404 });
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
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
    });

    return NextResponse.json({ 
      message: "Comment updated successfully",
      comment: updated
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}