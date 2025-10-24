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
    console.error('POST /api/posts error:', e);
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
        orderBy: { createdAt: "desc" },
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
          } : false
        }
      });

    const postsWithLikeStatus = posts.map(post => ({
      ...post,
      isLikedByUser: userId ? post.likes && post.likes.length > 0 : false,
      likes: undefined
    }));

    return NextResponse.json({ posts: postsWithLikeStatus });
  } catch (e) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: e instanceof Error ? e.message : 'Unknown error'
    }, { status: 500 });
  }
}