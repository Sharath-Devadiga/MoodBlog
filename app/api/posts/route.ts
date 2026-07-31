import { NextResponse, NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/utils/auth";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import cloudinary from "@/app/lib/cloudinary";
import { rankPosts } from "@/app/lib/utils/ranking";

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

export async function GET(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const { searchParams } = new URL(req.url);
    const viewedPostsParam = searchParams.get('viewedPosts');
    const viewedPosts: Set<string> = viewedPostsParam 
      ? new Set(JSON.parse(viewedPostsParam)) 
      : new Set();

    const posts = await prisma.post.findMany({
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
              colorIndex: true
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
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
  } catch (e) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: e instanceof Error ? e.message : 'Unknown error'
    }, { status: 500 });
  }
}