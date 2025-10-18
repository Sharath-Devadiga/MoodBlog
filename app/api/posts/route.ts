import { NextResponse, NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/utils/auth";
import { prisma } from "@/app/lib/prisma";
import cloudinary from "@/app/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getAuthenticatedUser(req);
    if (error) return error;

    const body = await req.json();
    const { title, content, mood, image } = body;

    const uploadedImage = await cloudinary.uploader.upload(image);

    const post = await prisma.post.create({
      data: {
        title,
        content,
        mood,
        image: uploadedImage.secure_url,
        userId: user!.id
      }
    });

    return NextResponse.json({ message: "Post created successfully" });
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { username: true, avatar: true }
          },
          likes: true,
          comments: {
            include: {
              user: {
                select: { username: true, avatar: true }
              }
            }
          }
        }
      });
    return NextResponse.json(posts);
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}