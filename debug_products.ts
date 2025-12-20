import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
    },
  });
  console.log("PRODUCTS_START");
  console.log(JSON.stringify(products, null, 2));
  console.log("PRODUCTS_END");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
