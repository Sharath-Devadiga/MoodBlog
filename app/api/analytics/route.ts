import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const moodAggregation = await prisma.post.groupBy({
        by: ['mood'],
        _count: true,
        });

        const moodCount: Record<string, number> = {};
        let mostCommonMood = "";
        let maxCount = 0;

        moodAggregation.forEach(moodGroup => {
        if (moodGroup.mood) {
            moodCount[moodGroup.mood] = moodGroup._count;

            if (moodGroup._count > maxCount) {
            maxCount = moodGroup._count;
            mostCommonMood = moodGroup.mood;
            }
        }
        });

        return NextResponse.json({
        moodCount,
        mostCommonMood
        });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
