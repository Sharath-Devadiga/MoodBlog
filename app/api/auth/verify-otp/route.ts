import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { otpStore } from '@/app/lib/otpStore';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedOtp = otp.toString().trim();

    const verification = await prisma.emailVerification.findFirst({
      where: {
        email: normalizedEmail,
        otp: normalizedOtp,
        verified: false,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (verification) {
      await prisma.emailVerification.update({
        where: { id: verification.id },
        data: { verified: true },
      });

      return NextResponse.json({
        message: 'OTP verified successfully',
        verified: true,
      });
    }

    const storedOtp = otpStore.get(normalizedEmail);

    if (!storedOtp || storedOtp.otp !== normalizedOtp) {
      return NextResponse.json({ 
        error: 'Invalid or expired OTP' 
      }, { status: 400 });
    }

    if (Date.now() > storedOtp.expiresAt) {
      otpStore.delete(normalizedEmail);
      return NextResponse.json({
        error: 'Invalid or expired OTP',
      }, { status: 400 });
    }

    return NextResponse.json({
      message: 'OTP verified successfully',
      verified: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
