import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  console.log("Categories:", JSON.stringify(categories, null, 2));

  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    take: 5,
  });
  console.log(
    "Sample Products with Categories:",
    JSON.stringify(
      products.map((p) => ({
        name: p.name,
        categoryId: p.categoryId,
        category: p.category,
      })),
      null,
      2
    )
  );
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
