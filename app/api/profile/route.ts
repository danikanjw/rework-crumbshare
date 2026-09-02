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

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        image: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch profile." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
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

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const username =
      typeof body.username === "string"
        ? body.username.trim()
        : "";

    const phone =
      typeof body.phone === "string" ? body.phone.trim() : "";

    if (!name) {
      return NextResponse.json(
        { message: "Name is required." },
        { status: 400 },
      );
    }

    if (!username) {
      return NextResponse.json(
        { message: "Username is required." },
        { status: 400 },
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        {
          message:
            "Username can only contain letters, numbers, and underscores.",
        },
        { status: 400 },
      );
    }

    if (username.length > 25) {
      return NextResponse.json(
        { message: "Username must be 25 characters or less." },
        { status: 400 },
      );
    }

    if (!phone) {
      return NextResponse.json(
        { message: "Phone number is required." },
        { status: 400 },
      );
    }

    if (!/^[0-9+\-\s()]+$/.test(phone)) {
      return NextResponse.json(
        { message: "Invalid phone number format." },
        { status: 400 },
      );
    }

    try {
      const updatedUser = await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          name,
          username,
          phone,
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          phone: true,
          image: true,
        },
      });

      return NextResponse.json(updatedUser);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Unique constraint")
      ) {
        return NextResponse.json(
          {
            message: "Username or phone number is already in use.",
          },
          { status: 409 },
        );
      }

      throw error;
    }
  } catch (error) {
    console.error("PATCH PROFILE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update profile." },
      { status: 500 },
    );
  }
}