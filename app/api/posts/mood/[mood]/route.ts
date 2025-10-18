import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { MOODS, MoodType } from "@/app/utils/constants";

export async function GET(
  req: NextRequest,
  context: { params: { mood: string } }
) {
  try {
    const moodParam = context.params.mood.toLowerCase();

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
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching mood posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
