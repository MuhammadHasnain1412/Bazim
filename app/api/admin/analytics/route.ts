import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get sales data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailySales = await prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM Order 
      WHERE createdAt >= ${thirtyDaysAgo}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `;

    // Get order status distribution
    const orderStatusDistribution = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    // Get top categories by sales
    const categorySales = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 10
    });

    const productIds = categorySales.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      },
      include: {
        category: true
      }
    });

    // Group by category
    const categoryData = products.reduce((acc: any, product) => {
      const categoryName = product.category.name;
      const salesItem = categorySales.find(item => item.productId === product.id);
      const quantity = salesItem?._sum.quantity || 0;
      
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += quantity;
      return acc;
    }, {});

    // Get monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') as month,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM Order 
      WHERE createdAt >= ${sixMonthsAgo}
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
      ORDER BY month ASC
    `;

    // Get customer metrics
    const totalCustomers = await prisma.user.count({
      where: {
        role: 'CUSTOMER'
      }
    });

    const newCustomersThisMonth = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    // Get average order value
    const orderStats = await prisma.order.aggregate({
      _avg: {
        total: true
      },
      _count: {
        id: true
      }
    });

    return NextResponse.json({
      dailySales,
      orderStatusDistribution: orderStatusDistribution.map(item => ({
        status: item.status,
        count: item._count.id
      })),
      categorySales: Object.entries(categoryData).map(([category, quantity]) => ({
        category,
        quantity
      })),
      monthlyRevenue,
      customerMetrics: {
        totalCustomers,
        newCustomersThisMonth
      },
      averageOrderValue: orderStats._avg.total || 0,
      totalOrders: orderStats._count.id
    });
  } catch (error) {
    console.error("Analytics data error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
