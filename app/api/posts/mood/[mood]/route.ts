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
        } : false,
        comments: userId ? {
          where: {
            userId: userId
          },
          select: {
            id: true
          }
        } : false
      }
    });

    const postsWithScore = posts.map(post => {
      const now = new Date();
      const postAge = (now.getTime() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
      
      const likeCount = post._count.likes;
      const commentCount = post._count.comments;
      const userInteracted = userId ? (post.likes && post.likes.length > 0) || (post.comments && post.comments.length > 0) : false;
      
      const engagementScore = 
        (likeCount * 2) +
        (commentCount * 3) +
        (userInteracted ? 50 : 0) +
        (1 / (postAge + 1)) * 20;

      return {
        ...post,
        isLikedByUser: userId ? post.likes && post.likes.length > 0 : false,
        engagementScore,
        likes: undefined,
        comments: undefined
      };
    });

    const sortedPosts = postsWithScore.sort((a, b) => b.engagementScore - a.engagementScore);

    const finalPosts = sortedPosts.map(({ engagementScore, ...post }) => post);

    return NextResponse.json({ posts: finalPosts });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
