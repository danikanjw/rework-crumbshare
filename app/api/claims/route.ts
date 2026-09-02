import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 },
      );
    }

    const claims = await prisma.claim.findMany({
      where: {
        recipientId: session.user.id,
      },
      include: {
        food: {
          select: {
            foodId: true,
            title: true,
            city: true,
            imageUrl: true,
            quantity: true,
            expiredAt: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(claims);
  } catch (error) {
    console.error("GET CLAIMS ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch claims." },
      { status: 500 },
    );
  }
}