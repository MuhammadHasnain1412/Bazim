import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const productId: string | null = data.get("productId") as unknown as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Save image to database
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create base image data without product relation
    let imageData: any = {
      filename: file.name,
      mimeType: file.type,
      data: buffer,
      size: file.size,
    };

    // Only add product relation if productId is provided and not empty
    if (productId && productId.trim() !== "") {
      imageData = {
        ...imageData,
        product: {
          connect: { id: productId },
        },
      };
    }

    const image = await prisma.image.create({
      data: imageData,
    });

    return NextResponse.json({ imageId: image.id });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "No image ID provided" },
        { status: 400 }
      );
    }

    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return new NextResponse(Buffer.from(image.data), {
      headers: {
        "Content-Type": image.mimeType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error retrieving image:", error);
    return NextResponse.json(
      { error: "Error retrieving image" },
      { status: 500 }
    );
  }
}
