import { Prisma, PrismaClient } from "@prisma/client";
import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
        name: 'Login with email',
        credentials: {
          email: { label: 'Email', type: 'text', placeholder: '' },
          password: { label: 'Password', type: 'password', placeholder: '' },
        },
        async authorize(credentials: any) {
            
           const email = credentials?.email;
           const password = credentials?.password;

           if (!email || !password) {
            return null; 
          }


           const user  = await prisma.user.findUnique({where: {email} })

           if(!user || !user.password){
            return null;
           }

           const hashedPassword = await bcrypt.compare(password,user.password)

           if(!hashedPassword){
            return null;
           }

           return {
            id: user.id.toString(),
            email: user.email,
            username: user.username,

           }
           
        },

      })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  }
})

export { handler as GET, handler as POST }