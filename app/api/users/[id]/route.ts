import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/utils/auth";
import { validateUserId } from "@/app/lib/utils/validation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { user, error } = await getAuthenticatedUser(req);
    if (error) return error;

    const session: any = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    const params = await context.params;
    const { userId, error: validationError } = validateUserId(params.id);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        publicUsername: true,
        bio: true,
        avatarId: true,
        colorIndex: true,
        createdAt: true,
        posts: {
          select: {
            id: true,
            content: true,
            mood: true,
            imageUrl: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                publicUsername: true,
                avatarId: true,
                colorIndex: true,
              }
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              }
            },
            likes: currentUserId ? {
              where: {
                userId: currentUserId
              },
              select: {
                id: true
              }
            } : false
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const postsWithLikeStatus = {
      ...userProfile,
      posts: userProfile.posts.map(post => ({
        ...post,
        isLikedByUser: currentUserId ? post.likes && post.likes.length > 0 : false,
        likes: undefined
      }))
    };

    return NextResponse.json(postsWithLikeStatus);
  } catch (e) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}