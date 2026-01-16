import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api/middleware";
import { successResponse, errorResponse } from "@/lib/api/responses";
import {
  createProductSchema,
  productQuerySchema,
} from "@/lib/validation/product";
import { logger } from "@/lib/utils/logger";
import { generateUniqueProductSlug } from "@/lib/utils/slug";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const query = productQuerySchema.parse({
      fabric: searchParams.get("fabric") ?? undefined,
      featured: searchParams.get("featured") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      new: searchParams.get("new") ?? undefined,
    });

    // Build type-safe filter clauses
    const filterClauses: Prisma.ProductWhereInput[] = [];

    if (query.fabric) {
      filterClauses.push({
        fabricType: { contains: query.fabric },
      });
    }

    if (query.featured === "true") {
      filterClauses.push({ featured: true });
    }

    if (query.search) {
      filterClauses.push({
        OR: [
          { name: { contains: query.search } },
          { description: { contains: query.search } },
        ],
      });
    }

    const where: Prisma.ProductWhereInput =
      filterClauses.length > 0 ? { AND: filterClauses } : {};

    const products = await prisma.product.findMany({
      where,
      include: {
        images: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse({ products });
  } catch (error) {
    return errorResponse(error, "Failed to fetch products");
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin(request);

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    // Generate unique slug
    const uniqueSlug = await generateUniqueProductSlug(validatedData.slug);

    // Create product
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        slug: uniqueSlug,
        description: validatedData.description,
        price: validatedData.price,
        stock: validatedData.stock,
        fabricType: validatedData.fabricType,
        featured: validatedData.featured,
      },
    });

    logger.info(`Product created: ${product.id} - ${product.name}`);

    return successResponse({ product }, 201);
  } catch (error) {
    logger.error("Error creating product:", error);
    return errorResponse(error, "Failed to create product");
  }
}
