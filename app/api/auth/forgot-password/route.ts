import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import crypto from 'crypto';
import { otpStore } from '@/app/lib/otpStore';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User with this email does not exist' },
        { status: 404 }
      );
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    
    otpStore.set(normalizedEmail, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const nodemailer = require('nodemailer');
        
        
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true', 
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || `"MoodBlog" <${process.env.SMTP_USER}>`,
          to: normalizedEmail,
          subject: 'Your Password Reset OTP - MoodBlog',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #f97316; margin: 0;">🔐 MoodBlog</h1>
              </div>
              
              <div style="background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
                <h2 style="color: white; margin: 0 0 10px 0;">Password Reset Request</h2>
                <p style="color: rgba(255,255,255,0.9); margin: 0;">Use the code below to reset your password</p>
              </div>
              
              <div style="background: #f3f4f6; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0;">
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
                <h1 style="color: #1f2937; font-size: 40px; letter-spacing: 10px; margin: 0; font-weight: bold;">${otp}</h1>
                <p style="color: #ef4444; font-size: 14px; margin: 15px 0 0 0; font-weight: 600;">⏰ Expires in 10 minutes</p>
              </div>
              
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact support if you have concerns.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 12px; margin: 0;">
                  This is an automated message from MoodBlog. Please do not reply to this email.
                </p>
                <p style="color: #9ca3af; font-size: 11px; margin: 10px 0 0 0;">
                  © 2025 MoodBlog. All rights reserved.
                </p>
              </div>
            </div>
          `,
          text: `
MoodBlog - Password Reset Request

Your OTP code is: ${otp}

This code expires in 10 minutes.

If you didn't request this, please ignore this email.

© 2025 MoodBlog
          `,
        });
      } catch (emailError) {
        
      }
    }

    const emailConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    
    return NextResponse.json({
      message: emailConfigured 
        ? 'OTP has been sent to your email. Please check your inbox.' 
        : 'OTP generated successfully',
      otp: process.env.NODE_ENV === 'development' && !emailConfigured ? otp : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
