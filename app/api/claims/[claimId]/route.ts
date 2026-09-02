import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ claimId: string }> },
) {
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

    const { claimId } = await params;

    const body = await request.json();
    const { status } = body;

    if (status !== "ACCEPTED" && status !== "REJECTED") {
      return NextResponse.json(
        { message: "Invalid claim status." },
        { status: 400 },
      );
    }

    const claim = await prisma.claim.findUnique({
      where: {
        claimId,
      },
      include: {
        food: true,
      },
    });

    if (!claim) {
      return NextResponse.json(
        { message: "Claim not found." },
        { status: 404 },
      );
    }

    // Pastikan claim ini memang berasal dari food milik donor
    if (claim.food.donorId !== session.user.id) {
      return NextResponse.json(
        { message: "You are not allowed to manage this claim." },
        { status: 403 },
      );
    }

    // Claim yang sudah diproses tidak boleh diproses lagi
    if (claim.status !== "PENDING") {
      return NextResponse.json(
        { message: "This claim has already been processed." },
        { status: 409 },
      );
    }

    const now = new Date();

    // =========================
    // CHECK EXPIRY
    // =========================

    if (claim.food.expiredAt <= now) {
      await prisma.$transaction(async (tx) => {
        // Ubah food menjadi EXPIRED
        await tx.food.updateMany({
          where: {
            foodId: claim.foodId,
            status: "AVAILABLE",
          },
          data: {
            status: "EXPIRED",
          },
        });

        // Tolak semua claim yang masih pending
        await tx.claim.updateMany({
          where: {
            foodId: claim.foodId,
            status: "PENDING",
          },
          data: {
            status: "REJECTED",
          },
        });
      });

      return NextResponse.json(
        {
          message:
            "This food has expired. All pending claims have been rejected.",
        },
        { status: 409 },
      );
    }

    // =========================
    // REJECT
    // =========================

    if (status === "REJECTED") {
      const updatedClaim = await prisma.claim.updateMany({
        where: {
          claimId,
          status: "PENDING",
        },
        data: {
          status: "REJECTED",
        },
      });

      if (updatedClaim.count !== 1) {
        return NextResponse.json(
          { message: "Claim has already been processed." },
          { status: 409 },
        );
      }

      return NextResponse.json({
        message: "Claim rejected successfully.",
      });
    }

    // =========================
    // ACCEPT
    // =========================

    const result = await prisma.$transaction(async (tx) => {
      // Food harus masih AVAILABLE dan belum expired
      const foodUpdated = await tx.food.updateMany({
        where: {
          foodId: claim.foodId,
          status: "AVAILABLE",
          expiredAt: {
            gt: now,
          },
        },
        data: {
          status: "CLAIMED",
        },
      });

      if (foodUpdated.count !== 1) {
        throw new Error("FOOD_NOT_AVAILABLE");
      }

      // Accept claim yang dipilih
      const acceptedClaim = await tx.claim.updateMany({
        where: {
          claimId,
          status: "PENDING",
        },
        data: {
          status: "ACCEPTED",
        },
      });

      if (acceptedClaim.count !== 1) {
        throw new Error("CLAIM_ALREADY_PROCESSED");
      }

      // Reject semua claim lain untuk food yang sama
      await tx.claim.updateMany({
        where: {
          foodId: claim.foodId,
          claimId: {
            not: claimId,
          },
          status: "PENDING",
        },
        data: {
          status: "REJECTED",
        },
      });

      return acceptedClaim;
    });

    return NextResponse.json({
      message: "Claim accepted successfully.",
      result,
    });
  } catch (error) {
    console.error("PATCH CLAIM ERROR:", error);

    if (error instanceof Error) {
      if (error.message === "FOOD_NOT_AVAILABLE") {
        return NextResponse.json(
          {
            message:
              "This food is no longer available or has already expired.",
          },
          { status: 409 },
        );
      }

      if (error.message === "CLAIM_ALREADY_PROCESSED") {
        return NextResponse.json(
          { message: "Claim has already been processed." },
          { status: 409 },
        );
      }
    }

    return NextResponse.json(
      { message: "Failed to update claim." },
      { status: 500 },
    );
  }
}