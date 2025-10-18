import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/utils/auth";
import { validateCommentId } from "@/app/lib/utils/validation";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { user, error } = await getAuthenticatedUser(req);
    if (error) return error;

    const { commentId, error: validationError } = validateCommentId(context.params.id);
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

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { user, error } = await getAuthenticatedUser(req);
    if (error) return error;

    const { commentId, error: validationError } = validateCommentId(context.params.id);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const body = await req.json();
    const { content } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Comment content cannot be empty" }, { status: 400 });
    }

    const updated = await prisma.comment.updateMany({
      where: {
        id: commentId,
        userId: user!.id, 
      },
      data: { content }
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Comment not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Comment updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}