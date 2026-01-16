import { z } from "zod";

/**
 * Order validation schemas
 */

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be positive"),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
  shippingName: z
    .string()
    .min(1, "Shipping name is required")
    .max(100, "Name is too long"),
  shippingPhone: z
    .string()
    .min(10, "Phone number is too short")
    .max(20, "Phone number is too long"),
  shippingAddress: z
    .string()
    .min(10, "Address is too short")
    .max(500, "Address is too long"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

export type OrderItem = z.infer<typeof orderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
