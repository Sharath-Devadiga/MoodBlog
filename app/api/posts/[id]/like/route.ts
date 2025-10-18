import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/utils/auth";
import { validatePostId } from "@/app/lib/utils/validation";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { user, error } = await getAuthenticatedUser(req);
    if (error) return error;

    const result = validatePostId(context.params.id);
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      const postId = result.postId;


    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user!.id,
          postId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: user!.id,
            postId,
          },
        },
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.like.create({
        data: {
          userId: user!.id,
          postId,
        },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const result = validatePostId(context.params.id);
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      const postId = result.postId;


    const { searchParams } = new URL(req.url);

    if (searchParams.get("user") === "true") {
      const { user, error } = await getAuthenticatedUser(req);
      if (error) return error;

      const liked = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: user!.id,
            postId,
          },
        },
      });

      return NextResponse.json({ liked: !!liked });
    }

    if (searchParams.get("users") === "true") {
      const likes = await prisma.like.findMany({
        where: { postId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

      const users = likes.map((like) => like.user);
      return NextResponse.json({ users });
    }

    const count = await prisma.like.count({
      where: { postId },
    });

    return NextResponse.json({ count });
  } catch (e) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}