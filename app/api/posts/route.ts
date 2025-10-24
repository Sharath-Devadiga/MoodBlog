import { NextResponse, NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/utils/auth";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import cloudinary from "@/app/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getAuthenticatedUser(req);
    if (error) return error;

    const body = await req.json();
    const { content, mood, imageUrl } = body;

    if (!content && !imageUrl) {
      return NextResponse.json(
        { error: 'Post must contain either text or an image' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        content: content || null,
        mood: mood || null,
        imageUrl: imageUrl || null,
        userId: user!.id
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
            colorIndex: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "Post created successfully",
      post 
    });
  } catch (e) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: e instanceof Error ? e.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const posts = await prisma.post.findMany({
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
              colorIndex: true
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
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
      
      const engagementScore = 
        (likeCount * 2) +
        (commentCount * 3) +
        (1 / (postAge + 1)) * 25;

      return {
        ...post,
        isLikedByUser: userId ? post.likes && post.likes.length > 0 : false,
        hasUserCommented: userId ? post.comments && post.comments.length > 0 : false,
        engagementScore,
        likes: undefined,
        comments: undefined
      };
    });

    const sortedPosts = postsWithScore.sort((a, b) => b.engagementScore - a.engagementScore);

    const finalPosts = sortedPosts.map(({ engagementScore, hasUserCommented, ...post }) => post);

    return NextResponse.json({ posts: finalPosts });
  } catch (e) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: e instanceof Error ? e.message : 'Unknown error'
    }, { status: 500 });
  }
}