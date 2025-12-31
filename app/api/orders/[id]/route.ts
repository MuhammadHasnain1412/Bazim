import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tokenData = getUserFromRequest(request);
    if (!tokenData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
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
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
    });

    // Only allow access if user is admin or order owner
    if (user?.role !== "ADMIN" && order.userId !== tokenData.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch order" },
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
    const { status } = await request.json();

    // Get current order with items to check status transition
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if status is changing to DELIVERED from a non-DELIVERED status
    const isMarkingDelivered =
      status === "DELIVERED" && currentOrder.status !== "DELIVERED";

    if (isMarkingDelivered) {
      // Validate stock availability before proceeding
      for (const item of currentOrder.items) {
        if (item.product.stock < item.quantity) {
          return NextResponse.json(
            {
              error: "Insufficient stock",
              details: `Product "${item.product.name}" has only ${item.product.stock} units available, but ${item.quantity} units are required`,
            },
            { status: 400 }
          );
        }
      }
    }

    // Use transaction for atomic operations
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update order status
      const order = await tx.order.update({
        where: { id },
        data: { status },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // If marking as delivered, deduct stock
      if (isMarkingDelivered) {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      return order;
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error("Order update failed:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
