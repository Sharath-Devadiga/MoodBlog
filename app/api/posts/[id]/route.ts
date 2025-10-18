import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/utils/auth";
import { validatePostId } from "@/app/lib/utils/validation";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { user, error } = await getAuthenticatedUser(req);
    if (error) return error;

    const { postId, error: validationError } = validatePostId(context.params.id);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: { id: true, username: true, avatar: true }
        },
        likes: {
          select: {
            user: { select: { username: true } }
          }
        },
        comments: {
          include: {
            user: {
              select: { id: true, username: true, avatar: true }
            }
          }
        }
      }
    });


    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (e) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { user, error } = await getAuthenticatedUser(req);
    if (error) return error;

    const { postId, error: validationError } = validatePostId(context.params.id);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const existingPost = await prisma.post.findFirst({
      where: { id: postId, userId: user!.id }
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.post.delete({
      where: { id: postId }
    });

    return NextResponse.json({ message: "Post deleted successfully!" });
  } catch (e) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { user, error } = await getAuthenticatedUser(req);
    if (error) return error;

    const { postId, error: validationError } = validatePostId(context.params.id);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const body = await req.json();
    const { title, content, mood, image } = body;

    const post = await prisma.post.updateMany({
      where: { id: postId, userId: user!.id },
      data: { title, content, mood, image }
    });

    if (post.count === 0) {
      return NextResponse.json({ error: "Post not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post updated successfully!" });
  } catch (e) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}