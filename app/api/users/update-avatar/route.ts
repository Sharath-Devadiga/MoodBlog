import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { AVATAR_ANIMALS, AVATAR_COLORS } from "@/app/utils/constants";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { animalId, colorIndex } = await request.json();

    if (animalId !== null && typeof animalId !== "string") {
      return NextResponse.json(
        { error: "Invalid animal ID" },
        { status: 400 }
      );
    }

    if (colorIndex !== undefined && colorIndex !== null && (typeof colorIndex !== "number" || colorIndex < 0 || colorIndex >= AVATAR_COLORS.length)) {
      return NextResponse.json(
        { error: "Invalid color index" },
        { status: 400 }
      );
    }

    if (animalId && !AVATAR_ANIMALS.find(a => a.id === animalId)) {
      return NextResponse.json(
        { error: "Invalid animal ID" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (animalId !== undefined) {
      updateData.avatarId = animalId;
    }
    if (colorIndex !== undefined && colorIndex !== null) {
      updateData.colorIndex = colorIndex;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        publicUsername: true,
        avatarId: true,
        colorIndex: true,
      },
    });

    return NextResponse.json({
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
