import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

// Replicate the prisma client creation logic to ensure it works in standalone script

// More robust env var parsing if needed, but for this script we will try to use the existing client if possible,
// or just standard vanilla prisma if the adapter is causing issues in scripts (common with experimental adapters).
// However, since we fixed lib/prisma.ts, let's try to import that first?
// Actually, importing from lib/prisma.ts in a script might fail if paths aren't set up for ts-node perfectly.
// Let's just use a standard PrismaClient for this script to be safe and simple.

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Resetting admin password...");

  const email = "admin@bazim.com";
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      email,
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin user '${user.email}' updated successfully.`);
  console.log(`🔑 Password set to: ${password}`);
}

main()
  .catch((e) => {
    console.error("❌ Error resetting password:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
