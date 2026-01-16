import { z } from "zod";

/**
 * Product validation schemas
 */

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name is too long"),
  slug: z.string().min(1, "Slug is required").max(200, "Slug is too long"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce
    .number()
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative"),
  fabricType: z.string().min(1, "Fabric type is required"),
  featured: z.boolean().optional().default(false),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  fabric: z.string().optional(),
  featured: z.enum(["true", "false"]).optional(),
  search: z.string().optional(),
  new: z.enum(["true", "false"]).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
