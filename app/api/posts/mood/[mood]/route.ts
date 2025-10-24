import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { MOODS, MoodType } from "@/app/utils/constants";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ mood: string }> }
) {
  try {
    const session: any = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const params = await context.params;
    const moodParam = params.mood.toLowerCase();

    const validMood = MOODS.some((mood) => mood.value === moodParam);
    if (!validMood) {
      return NextResponse.json(
        { error: "Invalid mood category" },
        { status: 404 }
      );
    }

    const posts = await prisma.post.findMany({
      where: {
        mood: moodParam as MoodType,
      },
      select: {
        id: true,
        content: true,
        imageUrl: true,
        mood: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            publicUsername: true,
            avatarId: true,
            colorIndex: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: userId ? {
          where: {
            userId: userId
          },
          select: {
            id: true
          }
        } : false
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const postsWithLikeStatus = posts.map(post => ({
      ...post,
      isLikedByUser: userId ? post.likes && post.likes.length > 0 : false,
      likes: undefined
    }));

    return NextResponse.json({ posts: postsWithLikeStatus });
  } catch (error) {
    console.error("Error fetching mood posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
