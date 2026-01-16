import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@bazim.com" },
    update: {
      password: hashedPassword,
      role: "ADMIN",
      name: "Admin User",
    },
    create: {
      email: "admin@bazim.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created/updated:", admin.email);
  console.log("\n🎉 Database seed completed successfully!");
  console.log("\n📧 Admin credentials:");
  console.log("   Email: admin@bazim.com");
  console.log("   Password: admin123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
