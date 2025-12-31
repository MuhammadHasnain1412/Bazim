import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        images: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Increment view count
    await prisma.product.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tokenData = getUserFromRequest(request);
    if (!tokenData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        stock: data.stock,
        fabricType: data.fabricType,
        fabricGSM: data.fabricGSM,
        designType: data.designType,
        colors: Array.isArray(data.colors)
          ? data.colors.join(", ")
          : data.colors,
        sizes: Array.isArray(data.sizes) ? data.sizes.join(", ") : data.sizes,
        featured: data.featured,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tokenData = getUserFromRequest(request);

    if (!tokenData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting product:", error);

    // Handle Prisma specific errors
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          error:
            "Cannot delete product because it is part of existing orders or other records.",
        },
        { status: 400 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        error:
          "Failed to delete product: " + (error.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}
