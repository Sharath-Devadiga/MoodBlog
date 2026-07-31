import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { MOODS, MoodType } from "@/app/utils/constants";
import { rankPosts } from "@/app/lib/utils/ranking";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ mood: string }> }
) {
  try {
    const session: any = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const params = await context.params;
    const moodParam = params.mood.toLowerCase();

    const { searchParams } = new URL(req.url);
    const viewedPostsParam = searchParams.get('viewedPosts');
    const viewedPosts: Set<string> = viewedPostsParam 
      ? new Set(JSON.parse(viewedPostsParam)) 
      : new Set();

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
      take: 100,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        imageUrl: true,
        mood: true,
        createdAt: true,
        userId: true,
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
        likes: {
          select: {
            userId: true
          }
        },
        comments: {
          select: {
            userId: true
          }
        }
      }
    });

    const rankedPosts = rankPosts(posts, userId, viewedPosts);

    return NextResponse.json({ posts: rankedPosts });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
