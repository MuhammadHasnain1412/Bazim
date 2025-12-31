import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const tokenData = getUserFromRequest(request);
    if (!tokenData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
    });

    const where: any =
      user?.role === "ADMIN" ? {} : { userId: tokenData.userId };

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const tokenData = getUserFromRequest(request);
    const { items, shippingName, shippingPhone, shippingAddress } =
      await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      const price = Number(product.price);
      total += price * item.quantity;
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: price.toString(),
        color: item.color,
      });
    }

    const order = await prisma.order.create({
      data: {
        user: tokenData?.userId
          ? { connect: { id: tokenData.userId } }
          : undefined,
        total: total.toString(),
        shippingName,
        shippingPhone,
        shippingAddress,
        status: "PENDING",
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (tokenData?.userId) {
      // Clear cart for logged-in user
      await prisma.cartItem.deleteMany({
        where: { userId: tokenData.userId },
      });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Order creation failed:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
