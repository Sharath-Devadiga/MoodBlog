import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import nodemailer from 'nodemailer';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ 
        error: 'Email already registered. Please use a different email or sign in.' 
      }, { status: 409 });
    }

    await prisma.emailVerification.deleteMany({
      where: {
        email,
        createdAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    const recentOTP = await prisma.emailVerification.findFirst({
      where: {
        email,
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000)
        }
      }
    });

    if (recentOTP) {
      return NextResponse.json({ 
        error: 'Please wait 60 seconds before requesting a new OTP' 
      }, { status: 429 });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.emailVerification.create({
      data: {
        email,
        otp,
        expiresAt,
      }
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'MoodBlog - Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #f43f5e 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">MoodBlog</h1>
          </div>
          <div style="background: #18181b; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #f97316;">Verify Your Email</h2>
            <p style="color: #a1a1aa; font-size: 16px;">Your verification code is:</p>
            <div style="background: #27272a; border: 2px solid #f97316; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #f97316; font-size: 36px; margin: 0; letter-spacing: 8px;">${otp}</h1>
            </div>
            <p style="color: #a1a1aa; font-size: 14px;">This code will expire in 10 minutes.</p>
            <p style="color: #a1a1aa; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      message: 'OTP sent successfully',
      expiresIn: 600
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to send OTP. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
