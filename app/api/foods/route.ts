import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Cek session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ubah food yang sudah lewat expiration menjadi EXPIRED
    await prisma.food.updateMany({
      where: {
        status: "AVAILABLE",
        expiredAt: {
          lt: new Date(),
        },
      },
      data: {
        status: "EXPIRED",
      },
    });

    // Ambil food yang masih tersedia
    const foods = await prisma.food.findMany({
      where: {
        status: "AVAILABLE",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(foods);
  } catch (error) {
    console.error("GET FOODS ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch foods." },
      { status: 500 }
    );
  }
}