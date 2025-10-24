// @ts-ignore - next-auth/jwt has type export issues
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma";

export async function getAuthenticatedUser(req: NextRequest) {
  try {
    // Get all cookies for debugging
    const cookies = req.cookies.getAll();
    console.log('[Auth] Available cookies:', cookies.map(c => c.name));
    
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production',
    });

    console.log('[Auth] Token:', token ? 'exists' : 'null', { hasEmail: !!token?.email, hasId: !!(token as any)?.id });

    if (!token?.email) {
      console.log('[Auth] No token or email found');
      return { error: NextResponse.json({ error: "Unauthorized - Please sign in again" }, { status: 401 }) };
    }

    const user = await prisma.user.findUnique({
      where: { email: token.email }
    });

    if (!user) {
      console.log('[Auth] User not found for email:', token.email);
      return { error: NextResponse.json({ error: "User not found" }, { status: 404 }) };
    }

    console.log('[Auth] User authenticated successfully:', user.id);
    return { user };
  } catch (error) {
    console.error('[Auth] Error in getAuthenticatedUser:', error);
    return { error: NextResponse.json({ error: "Authentication error - " + (error instanceof Error ? error.message : 'Unknown') }, { status: 500 }) };
  }
}