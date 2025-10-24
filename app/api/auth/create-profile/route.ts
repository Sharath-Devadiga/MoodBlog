import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { getRandomColorIndex } from '@/app/utils/constants';

export async function PUT(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { publicUsername } = await request.json();

    if (!publicUsername || typeof publicUsername !== 'string') {
      return NextResponse.json(
        { error: 'publicUsername is required and must be a string' },
        { status: 400 }
      );
    }

    const trimmedUsername = publicUsername.trim();

    if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
      return NextResponse.json(
        { error: 'Username must be between 3 and 30 characters' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      return NextResponse.json(
        { error: 'Username can only contain letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { publicUsername: true, id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.publicUsername) {
      return NextResponse.json(
        { error: 'Profile already created. Username cannot be changed.' },
        { status: 403 }
      );
    }

    const existingUsername = await prisma.user.findUnique({
      where: { publicUsername: trimmedUsername },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken. Please choose a different one.' },
        { status: 409 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        publicUsername: trimmedUsername,
        colorIndex: getRandomColorIndex(),
      },
      select: {
        id: true,
        publicUsername: true,
        avatarId: true,
        colorIndex: true,
        email: true,
      },
    });

    return NextResponse.json({
      message: 'Profile created successfully',
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
