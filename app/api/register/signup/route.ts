import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ 
        error: 'Email already registered. Please use a different email or sign in.' 
      }, { status: 409 })
    }

    const verification = await prisma.emailVerification.findFirst({
      where: {
        email,
        verified: true,
        expiresAt: {
          gte: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!verification) {
      return NextResponse.json({ 
        error: 'Email not verified. Please verify your email first.' 
      }, { status: 403 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        publicUsername: true,
        createdAt: true,
      }
    })

    await prisma.emailVerification.deleteMany({
      where: { email }
    });

    return NextResponse.json({ 
      message: 'User created successfully', 
      user 
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}