import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, getOptionalUser } from "@/lib/api/middleware";
import { successResponse, errorResponse } from "@/lib/api/responses";
import { addToCartSchema } from "@/lib/validation/cart";
import { NotFoundError } from "@/lib/api/errors";

interface CartResponse {
  item: {
    id: string;
    userId?: string;
    productId: string;
    quantity: number;
    product: unknown;
  };
  warning?: {
    type: "low_stock";
    message: string;
    remainingStock: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const tokenData = await requireAuth(request);

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: tokenData.userId },
      include: {
        product: {
          include: {
            images: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    return successResponse({ items: cartItems });
  } catch (error) {
    return errorResponse(error, "Failed to fetch cart");
  }
}

export async function POST(request: NextRequest) {
  try {
    const tokenData = getOptionalUser(request);

    // Parse and validate request body
    const body = await request.json();
    const { productId, quantity } = addToCartSchema.parse(body);

    // Get product to check stock availability
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    // Get existing cart item to check new total quantity
    let existingCartItem = null;
    if (tokenData) {
      existingCartItem = await prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId: tokenData.userId,
            productId,
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

      return successResponse(
        {
          error: "Insufficient stock",
          details: `Only ${availableQuantity} more units of "${product.name}" can be added to cart. Total available: ${product.stock}`,
          availableQuantity,
          currentStock: product.stock,
          currentCartQuantity: existingCartItem?.quantity || 0,
        },
        400
      );
    }

    let cartItem;
    if (tokenData) {
      // Logged-in user: update database cart
      cartItem = await prisma.cartItem.upsert({
        where: {
          userId_productId: {
            userId: tokenData.userId,
            productId,
          },
        },
        create: {
          userId: tokenData.userId,
          productId,
          quantity,
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
        product,
      };
    }

    // Build response with optional stock warning
    const response: CartResponse = { item: cartItem };

    if (product.stock <= 3) {
      response.warning = {
        type: "low_stock",
        message: `Only ${product.stock} units of "${product.name}" left in stock!`,
        remainingStock: product.stock,
      };
    }

    return successResponse(response);
  } catch (error) {
    return errorResponse(error, "Failed to add to cart");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const tokenData = await requireAuth(request);

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("id");

    if (!itemId) {
      return successResponse({ error: "Item ID required" }, 400);
    }

    await prisma.cartItem.delete({
      where: {
        id: itemId,
        userId: tokenData.userId,
      },
    });

    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error, "Failed to remove from cart");
  }
}
