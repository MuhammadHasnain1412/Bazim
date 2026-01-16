import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, getOptionalUser } from "@/lib/api/middleware";
import { successResponse, errorResponse } from "@/lib/api/responses";
import { createOrderSchema } from "@/lib/validation/order";
import { NotFoundError, ValidationError } from "@/lib/api/errors";
import { logger } from "@/lib/utils/logger";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const tokenData = await requireAuth(request);

    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
    });

    const where: Prisma.OrderWhereInput =
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

    return successResponse({ orders });
  } catch (error) {
    return errorResponse(error, "Failed to fetch orders");
  }
}

export async function POST(request: NextRequest) {
  try {
    const tokenData = getOptionalUser(request);

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    const { items, shippingName, shippingPhone, shippingAddress } =
      validatedData;

    // Fetch all products in one query (fixes N+1 problem)
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Create a map for quick lookup
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate all products exist and calculate total
    let total = 0;
    const orderItemsData: Array<{
      productId: string;
      quantity: number;
      price: string;
    }> = [];

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new NotFoundError(`Product ${item.productId} not found`);
      }

      // Check stock availability
      if (item.quantity > product.stock) {
        throw new ValidationError(
          `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
        );
      }

      const price = Number(product.price);
      total += price * item.quantity;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: price.toString(),
      });
    }

    // Create order with transaction to ensure atomicity
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
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

      // Update product stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    // Clear cart for logged-in user
    if (tokenData?.userId) {
      await prisma.cartItem.deleteMany({
        where: { userId: tokenData.userId },
      });
    }

    logger.info(`Order created: ${order.id} - Total: ${total}`);

    return successResponse({ order }, 201);
  } catch (error) {
    logger.error("Order creation failed:", error);
    return errorResponse(error, "Failed to create order");
  }
}
