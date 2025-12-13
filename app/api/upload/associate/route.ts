import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { imageId, productId } = await request.json();

    if (!imageId || !productId) {
      return NextResponse.json({ error: "Image ID and Product ID required" }, { status: 400 });
    }

    // Update image with productId to associate it with product
    const updatedImage = await prisma.image.update({
      where: { id: imageId },
      data: { productId },
    });

    return NextResponse.json({ 
      message: "Image associated with product successfully", 
      imageId: updatedImage.id,
      productId: updatedImage.productId
    });
  } catch (error) {
    console.error("Error associating image with product:", error);
    return NextResponse.json(
      { error: "Error associating image with product" },
      { status: 500 }
    );
  }
}
