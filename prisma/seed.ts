import 'dotenv/config';

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@bazim.com" },
    update: {},
    create: {
      email: "admin@bazim.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // Create sample categories for unstitched men's clothing
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "shalwar-kameez" },
      update: {},
      create: { name: "Shalwar Kameez", slug: "shalwar-kameez" },
    }),
    prisma.category.upsert({
      where: { slug: "kurta" },
      update: {},
      create: { name: "Kurta", slug: "kurta" },
    }),
    prisma.category.upsert({
      where: { slug: "waistcoat" },
      update: {},
      create: { name: "Waistcoat", slug: "waistcoat" },
    }),
    prisma.category.upsert({
      where: { slug: "sherwani" },
      update: {},
      create: { name: "Sherwani", slug: "sherwani" },
    }),
    prisma.category.upsert({
      where: { slug: "pathani-suit" },
      update: {},
      create: { name: "Pathani Suit", slug: "pathani-suit" },
    }),
    prisma.category.upsert({
      where: { slug: "pant-shirt" },
      update: {},
      create: { name: "Pant Shirt", slug: "pant-shirt" },
    }),
  ]);

  console.log("✅ Categories created:", categories.length);

  // Create sample products
  const sampleProducts = [
    {
      name: "Premium Cotton Shalwar Kameez",
      slug: "premium-cotton-shalwar-kameez",
      description:
        "High-quality cotton shalwar kameez perfect for everyday wear. Comfortable, breathable, and stylish.",
      price: 2999,
      stock: 50,
      categoryId: categories[0].id,
      fabricType: "Cotton",
      fabricGSM: "180 GSM",
      designType: "Plain",
      colors: JSON.stringify(["#FFFFFF", "#000000", "#4169E1"]),
      sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
      featured: true,
    },
    {
      name: "Designer Embroidered Kurta",
      slug: "designer-embroidered-kurta",
      description:
        "Elegant kurta with intricate embroidery work. Perfect for special occasions and family gatherings.",
      price: 4999,
      stock: 30,
      categoryId: categories[1].id,
      fabricType: "Cotton Blend",
      fabricGSM: "200 GSM",
      designType: "Embroidered",
      colors: JSON.stringify(["#8B0000", "#000080", "#2F4F4F"]),
      sizes: JSON.stringify(["M", "L", "XL"]),
      featured: true,
    },
    {
      name: "Traditional Waistcoat",
      slug: "traditional-waistcoat",
      description:
        "Classic waistcoat with modern styling. Perfect for formal events and traditional celebrations.",
      price: 3999,
      stock: 25,
      categoryId: categories[2].id,
      fabricType: "Wool Blend",
      fabricGSM: "240 GSM",
      designType: "Classic",
      colors: JSON.stringify(["#000000", "#8B4513", "#696969"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      featured: false,
    },
    {
      name: "Royal Sherwani",
      slug: "royal-sherwani",
      description:
        "Luxurious sherwani with exquisite embroidery. Perfect for weddings and formal events.",
      price: 15999,
      stock: 15,
      categoryId: categories[3].id,
      fabricType: "Silk Blend",
      fabricGSM: "250 GSM",
      designType: "Heavy Embroidered",
      colors: JSON.stringify(["#FFD700", "#8B0000", "#000080"]),
      sizes: JSON.stringify(["M", "L", "XL"]),
      featured: true,
    },
    {
      name: "Casual Kurta Pajama",
      slug: "casual-kurta-pajama",
      description:
        "Comfortable kurta pajama set for casual wear. Soft fabric with elegant design.",
      price: 1999,
      stock: 40,
      categoryId: categories[0].id,
      fabricType: "Polyester Blend",
      fabricGSM: "220 GSM",
      designType: "Plain",
      colors: JSON.stringify(["#000000", "#8B4513"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      featured: false,
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log("✅ Sample products created:", sampleProducts.length);
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
