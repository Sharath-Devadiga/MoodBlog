import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  
  return NextResponse.json(
    { 
      error: "Username cannot be changed. Your username is fixed for privacy and security reasons." 
    },
    { status: 403 }
  );
}
