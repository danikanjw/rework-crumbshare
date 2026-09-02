import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ foodId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { foodId } = await params;

    const food = await prisma.food.findUnique({
      where: {
        foodId,
      },
    });

    if (!food) {
      return NextResponse.json(
        { message: "Food not found." },
        { status: 404 }
      );
    }

    // Kalau sudah expired, update status
    if (
      food.status === "AVAILABLE" &&
      food.expiredAt <= new Date()
    ) {
      const updatedFood = await prisma.food.update({
        where: {
          foodId,
        },
        data: {
          status: "EXPIRED",
        },
      });

      return NextResponse.json(updatedFood);
    }

    return NextResponse.json(food);
  } catch (error) {
    console.error("GET FOOD DETAIL ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch food." },
      { status: 500 }
    );
  }
}