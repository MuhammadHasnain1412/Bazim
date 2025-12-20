import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get sales data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailySales = await prisma.$queryRaw<any[]>`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM \`Order\` 
      WHERE createdAt >= ${thirtyDaysAgo}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `;

    // Get order status distribution
    const orderStatusDistribution = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    // Get top fabric types by sales
    const productSales = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 20,
    });

    const productIds = productSales.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    // Group by fabric type
    const fabricData = products.reduce((acc: any, product) => {
      const fabricName = product.fabricType || "Premium";
      const salesItem = productSales.find(
        (item) => item.productId === product.id
      );
      const quantity = salesItem?._sum.quantity || 0;

      if (!acc[fabricName]) {
        acc[fabricName] = 0;
      }
      acc[fabricName] += quantity;
      return acc;
    }, {});

    // Get monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await prisma.$queryRaw<any[]>`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') as month,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM \`Order\` 
      WHERE createdAt >= ${sixMonthsAgo}
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
      ORDER BY month ASC
    `;

    // Get customer metrics
    const totalCustomers = await prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    });

    const newCustomersThisMonth = await prisma.user.count({
      where: {
        role: "CUSTOMER",
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    // Get average order value
    const orderStats = await prisma.order.aggregate({
      _avg: {
        total: true,
      },
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      dailySales,
      orderStatusDistribution: orderStatusDistribution.map((item) => ({
        status: item.status,
        count: item._count.id,
      })),
      fabricSales: Object.entries(fabricData).map(([fabric, quantity]) => ({
        fabric,
        quantity,
      })),
      monthlyRevenue,
      customerMetrics: {
        totalCustomers,
        newCustomersThisMonth,
      },
      averageOrderValue: Number(orderStats._avg.total || 0),
      totalOrders: orderStats._count.id,
    });
  } catch (error) {
    console.error("Analytics data error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
