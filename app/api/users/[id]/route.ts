import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/utils/auth";
import { validateUserId } from "@/app/lib/utils/validation";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { user, error } = await getAuthenticatedUser(req);
    if (error) return error;

    const { userId, error: validationError } = validateUserId(context.params.id);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        bio: true,
        avatar: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            mood: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            comments: {
              select: {
                id: true,
                content: true,
                createdAt: true,
                parentId: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: userProfile });
  } catch (e) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}