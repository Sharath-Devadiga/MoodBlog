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

    console.log('[Auth] Token:', token ? 'exists' : 'null', { hasEmail: !!token?.email });

    if (!token?.email) {
      console.log('[Auth] No token or email found');
      return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }

    const user = await prisma.user.findUnique({
      where: { email: token.email }
    });

    if (!user) {
      console.log('[Auth] User not found for email:', token.email);
      return { error: NextResponse.json({ error: "User not found" }, { status: 404 }) };
    }

    console.log('[Auth] User authenticated:', user.id);
    return { user };
  } catch (error) {
    console.error('[Auth] Error in getAuthenticatedUser:', error);
    return { error: NextResponse.json({ error: "Authentication error" }, { status: 500 }) };
  }
}