import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    // 1. Cek session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const donationCount = await prisma.food.count({
      where: {
        donorId: session.user.id,
      },
    });

    if (donationCount >= 5) {
      return NextResponse.json(
        {
          message: "Demo limit reached. You can create up to 5 food donations.",
        },
        { status: 403 },
      );
    }

    // 2. Ambil FormData
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const quantity = Number(formData.get("quantity"));
    const city = formData.get("city") as string;
    const expiredAt = formData.get("expiredAt") as string;
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { message: "Please upload an image." },
        { status: 400 },
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxFileSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { message: "Only JPG, PNG, and WebP images are allowed." },
        { status: 400 },
      );
    }

    if (image.size > maxFileSize) {
      return NextResponse.json(
        { message: "Image size must be less than 5 MB." },
        { status: 400 },
      );
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { message: "Quantity must be at least 1." },
        { status: 400 },
      );
    }

    const expiredAtDate = new Date(expiredAt);

    if (Number.isNaN(expiredAtDate.getTime()) || expiredAtDate <= new Date()) {
      return NextResponse.json(
        { message: "Expiration date must be in the future." },
        { status: 400 },
      );
    }

    // 3. Validasi
    if (!title || !quantity || !city || !expiredAt || !image) {
      return NextResponse.json(
        { message: "Please complete all required fields." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { message: "Quantity must be at least 1." },
        { status: 400 },
      );
    }

    // 4. Upload image ke Supabase
    const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `${crypto.randomUUID()}.${extension}`;

    const buffer = Buffer.from(await image.arrayBuffer());

    const { error: uploadError } = await supabaseServer.storage
      .from("food-images")
      .upload(fileName, buffer, {
        contentType: image.type,
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);

      return NextResponse.json(
        { message: "Failed to upload image." },
        { status: 500 },
      );
    }

    // 5. Ambil public URL
    const { data: publicUrlData } = supabaseServer.storage
      .from("food-images")
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // 6. Simpan Food ke database
    const food = await prisma.food.create({
      data: {
        donorId: session.user.id,
        title,
        description: description || null,
        quantity,
        city,
        imageUrl,
        expiredAt: new Date(expiredAt),
        status: "AVAILABLE",
      },
    });

    // 7. Response
    return NextResponse.json(
      {
        message: "Food successfully donated.",
        food,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE FOOD ERROR:", error);

    return NextResponse.json(
      { message: "Failed to create food donation." },
      { status: 500 },
    );
  }
}
