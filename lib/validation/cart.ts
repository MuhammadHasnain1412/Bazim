import { z } from "zod";

/**
 * Cart validation schemas
 */

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be positive"),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
