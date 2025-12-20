import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    const isNew = searchParams.get("new");

    const where: any = { AND: [] };

    if (category) {
      where.AND.push({
        OR: [
          { category: { slug: category } },
          { fabricType: { contains: category } },
        ],
      });
    }

    if (featured === "true") {
      where.AND.push({ featured: true });
    }

    if (isNew === "true") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      where.AND.push({
        createdAt: {
          gte: oneWeekAgo,
        },
      });
    }

    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      });
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const tokenData = getUserFromRequest(request);
    if (!tokenData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        stock: data.stock,
        fabricType: data.fabricType,
        fabricGSM: data.fabricGSM,
        designType: data.designType,
        categoryId: data.categoryId,
        colors: data.colors, // Client sends stringified JSON or plain string
        sizes: data.sizes, // Client sends stringified JSON or plain string
        featured: data.featured || false,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
