import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany();

  console.log(
    `Found ${products.length} products and ${categories.length} categories.`
  );

  for (const product of products) {
    // If categoryId is null or matches a slug instead of an ID
    if (
      !product.categoryId ||
      categories.every((c) => c.id !== product.categoryId)
    ) {
      // Try to find category by slug (which might be stored in categoryId or fabricType)
      const potentialSlug =
        product.categoryId || product.fabricType?.toLowerCase();
      const category =
        categories.find((c) => c.slug === potentialSlug) || categories[0]; // Fallback to first category if none found

      if (category) {
        await prisma.product.update({
          where: { id: product.id },
          data: { categoryId: category.id },
        });
        console.log(
          `Updated product "${product.name}" to category "${category.name}"`
        );
      }
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
