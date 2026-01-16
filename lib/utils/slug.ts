import { prisma } from "@/lib/prisma";

/**
 * Generates a unique slug for a product by appending a counter if the slug already exists.
 * @param baseSlug The desired slug
 * @returns A unique slug string
 */
export async function generateUniqueProductSlug(
  baseSlug: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
