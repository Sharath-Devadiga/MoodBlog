import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { NextResponse,NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import cloudinary from "@/app/lib/cloudinary";



const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try{
    // const session = await getServerSession(authOptions);

    // if (!session?.user?.email) {
    // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
    where: {
        // email: session.user.email,
        email: token.email
    },
    });

    if(!user){
        return NextResponse.json({error: "User does not exist!"});
    }

    const body = await req.json()
    const {title,content,mood,image} = body;

    const uploadedImage = await cloudinary.uploader.upload(image);
    console.log("Uploaded Image:", uploadedImage);


    const post = await prisma.post.create({
        data:{
            title,
            content,
            mood,
            image: uploadedImage.secure_url,
            userId: user.id
        }
    })

    return NextResponse.json({message: "Post created successfully"})
    } catch(e){

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })

    }

}

export async function GET(req: Request) {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { username: true, email: true, avatar: true }
      }
    }
  });

  return NextResponse.json(posts);
}
