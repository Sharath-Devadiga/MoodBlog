import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/utils/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getAuthenticatedUser(req);
    if (error) return error;

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
        userId: user!.id,
        postId: parseInt(postId),
        parentId: parentId ? parseInt(parentId) : null,
      },
    });

    return NextResponse.json({ message: "Comment created successfully", comment });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}