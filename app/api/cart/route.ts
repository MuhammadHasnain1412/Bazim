import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const tokenData = getUserFromRequest(request);
    if (!tokenData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: tokenData.userId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json({ items: cartItems });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const tokenData = getUserFromRequest(request);
    if (!tokenData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity, color } = await request.json();

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId_color: {
          userId: tokenData.userId,
          productId,
          color: color || "",
        },
      },
      create: {
        userId: tokenData.userId,
        productId,
        quantity,
        color,
      },
      update: {
        quantity: { increment: quantity },
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json({ item: cartItem });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const tokenData = getUserFromRequest(request);
    if (!tokenData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("id");

    if (!itemId) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    }

    await prisma.cartItem.delete({
      where: {
        id: itemId,
        userId: tokenData.userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 });
  }
}
