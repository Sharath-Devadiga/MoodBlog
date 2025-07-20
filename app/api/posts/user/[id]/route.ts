import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextResponse,NextRequest } from "next/server";


const prisma = new PrismaClient();

export async function GET(req: NextRequest,context: { params: { id: string } }) {
    try{
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        
        if(!token?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId =  parseInt(context.params.id)
         if (isNaN(userId)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                username: true,
                bio: true,
                avatar: true,
                posts: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                    mood: true,
                    image: true,
                    createdAt: true,
                    updatedAt: true,
                    comments: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        parentId: true,
                        user: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                        }
                        }
                    }
                    }
                }
                }
            }
            });


        if (!user) {
         return NextResponse.json({ error: "Post not found" }, { status: 404 });
         }

    return NextResponse.json({ user }, { status: 200 });

        
    } catch(e){
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

    }


}