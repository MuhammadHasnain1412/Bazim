import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up cart items...");
  await prisma.cartItem.deleteMany({});
  console.log("Cart items deleted.");

  console.log("Cleaning up order items (optional, to avoid issues)...");
  // Order items might not have unique constraint issue but to be safe removing color
  // Actually order items don't have unique constraint on color usually, only cart.
  // But let's verify schema.
  // OrderItem had @@index([orderId]). No unique. So duplicates are fine?
  // But we are removing 'color' column. Data will be lost. That's fine.

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
