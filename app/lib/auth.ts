import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: "Login with email",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "" },
        password: { label: "Password", type: "password", placeholder: "" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ 
          where: { email },
          select: { id: true, email: true, password: true, publicUsername: true, avatarId: true, colorIndex: true }
        });

        if (!user || !user.password) return null;

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (!isPasswordCorrect) return null;

        return {
          id: user.id,
          email: user.email,
          publicUsername: user.publicUsername,
          avatarId: user.avatarId,
          colorIndex: user.colorIndex,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  callbacks: {
    async jwt({ token, user, trigger }: any) {
      if (trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { id: true, email: true, publicUsername: true, avatarId: true, colorIndex: true }
        });
        
        if (dbUser) {
          token.publicUsername = dbUser.publicUsername;
          token.avatarId = dbUser.avatarId;
          token.colorIndex = dbUser.colorIndex;
        }
      }
      
      if (user) {
        token.id = user.id;
        token.publicUsername = (user as any).publicUsername;
        token.email = user.email;
        token.avatarId = (user as any).avatarId;
        token.colorIndex = (user as any).colorIndex;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).publicUsername = token.publicUsername as string | null;
        session.user.email = token.email as string;
        (session.user as any).avatarId = token.avatarId as string | null | undefined;
        (session.user as any).colorIndex = token.colorIndex as number | null | undefined;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};