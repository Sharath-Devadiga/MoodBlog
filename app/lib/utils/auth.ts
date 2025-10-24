// @ts-ignore - next-auth/jwt has type export issues
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma";

export async function getAuthenticatedUser(req: NextRequest) {
  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production',
    });

    if (!token?.email) {
      return { error: NextResponse.json({ error: "Unauthorized - Please sign in again" }, { status: 401 }) };
    }

    const user = await prisma.user.findUnique({
      where: { email: token.email }
    });

    if (!user) {
      return { error: NextResponse.json({ error: "User not found" }, { status: 404 }) };
    }

    return { user };
  } catch (error) {
    return { error: NextResponse.json({ error: "Authentication error - " + (error instanceof Error ? error.message : 'Unknown') }, { status: 500 }) };
  }
}