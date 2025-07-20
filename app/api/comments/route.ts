import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: token.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { postId, content, parentId } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Comment content cannot be empty" }, { status: 400 });
    }

    if (!postId || isNaN(parseInt(postId))) {
      return NextResponse.json({ error: "Invalid or missing postId" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: user.id,
        postId: parseInt(postId),
        parentId: parentId ? parseInt(parentId) : null,
      },
    });

    return NextResponse.json({ message: "Comment created successfully", comment });

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
