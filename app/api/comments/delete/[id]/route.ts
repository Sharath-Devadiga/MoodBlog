import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const commentId = parseInt(context.params.id);
    if (isNaN(commentId)) {
      return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: token.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existing = await prisma.comment.findFirst({
      where: {
        id: commentId,
        userId: user.id
      }
    });

    if (!existing) {
      return NextResponse.json({ error: "Comment not found or unauthorized" }, { status: 404 });
    }

    await prisma.comment.delete({
      where: {
        id: commentId
      }
    });

    return NextResponse.json({ message: "Comment deleted successfully" });

  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
