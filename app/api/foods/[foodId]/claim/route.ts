import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ foodId: string }> },
) {
  try {
    // 1. Cek session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 },
      );
    }

    const { foodId } = await params;

    // 2. Ambil note
    const body = await request.json();
    const note =
      typeof body.note === "string" ? body.note.trim() : null;

    // 3. Cari food
    const food = await prisma.food.findUnique({
      where: {
        foodId,
      },
    });

    if (!food) {
      return NextResponse.json(
        { message: "Food not found." },
        { status: 404 },
      );
    }

    // 4. Donor tidak boleh claim makanannya sendiri
    if (food.donorId === session.user.id) {
      return NextResponse.json(
        { message: "You cannot claim your own food donation." },
        { status: 400 },
      );
    }

    // 5. Cek expiration
    const now = new Date();

    if (food.expiredAt <= now || food.status === "EXPIRED") {
      // Update status kalau belum expired
      if (food.status !== "EXPIRED") {
        await prisma.food.update({
          where: {
            foodId,
          },
          data: {
            status: "EXPIRED",
          },
        });
      }

      return NextResponse.json(
        { message: "This food donation has expired." },
        { status: 400 },
      );
    }

    // 6. Pastikan food masih available
    if (food.status !== "AVAILABLE") {
      return NextResponse.json(
        { message: "This food is no longer available." },
        { status: 400 },
      );
    }

    // 7. Cek apakah user sudah pernah claim food ini
    const existingClaim = await prisma.claim.findFirst({
      where: {
        foodId,
        recipientId: session.user.id,
      },
    });

    if (existingClaim) {
      return NextResponse.json(
        { message: "You have already claimed this food." },
        { status: 400 },
      );
    }

    // 8. Buat claim
    const claim = await prisma.claim.create({
      data: {
        foodId,
        recipientId: session.user.id,
        status: "PENDING",
        note: note || null,
      },
    });

    return NextResponse.json(
      {
        message: "Claim request submitted.",
        claim,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE CLAIM ERROR:", error);

    return NextResponse.json(
      { message: "Failed to submit claim." },
      { status: 500 },
    );
  }
}