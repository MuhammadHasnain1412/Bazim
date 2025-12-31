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
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const tokenData = getUserFromRequest(request);
    const { productId, quantity, color } = await request.json();

    // Get product to check stock availability
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get existing cart item to check new total quantity
    let existingCartItem = null;
    if (tokenData) {
      existingCartItem = await prisma.cartItem.findUnique({
        where: {
          userId_productId_color: {
            userId: tokenData.userId,
            productId,
            color: color || "",
          },
        },
      });
    }

    const newTotalQuantity = existingCartItem
      ? existingCartItem.quantity + quantity
      : quantity;

    // Check stock availability
    if (newTotalQuantity > product.stock) {
      const availableQuantity =
        product.stock - (existingCartItem?.quantity || 0);
      return NextResponse.json(
        {
          error: "Insufficient stock",
          details: `Only ${availableQuantity} more units of "${product.name}" can be added to cart. Total available: ${product.stock}`,
          availableQuantity,
          currentStock: product.stock,
          currentCartQuantity: existingCartItem?.quantity || 0,
        },
        { status: 400 }
      );
    }

    let cartItem;
    if (tokenData) {
      // Logged-in user: update database cart
      cartItem = await prisma.cartItem.upsert({
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
    } else {
      // Anonymous user: just return success (cart is handled locally)
      cartItem = {
        id: `${productId}-${Date.now()}`,
        productId,
        quantity,
        color,
        product,
      };
    }

    // Add stock warning if running low
    const response: any = { item: cartItem };
    if (product.stock <= 3) {
      response.warning = {
        type: "low_stock",
        message: `Only ${product.stock} units of "${product.name}" left in stock!`,
        remainingStock: product.stock,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}
