import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const commentId = Number(context.params.id);
    console.log(commentId)
    
    if (isNaN(commentId)) {
      return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: token.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { content } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Comment content cannot be empty" }, { status: 400 });
    }
console.log("Logged in user ID:", user.id);

    const updated = await prisma.comment.updateMany({
      where: {
        id: commentId,
        userId: user.id, 
      },
      data: {
        content,
      }
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Comment not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Comment updated successfully" });

  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
