import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get total products count
    const totalProducts = await prisma.product.count();

    // Get total orders count
    const totalOrders = await prisma.order.count();

    // Get total revenue (sum of all completed/delivered orders)
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['DELIVERED', 'SHIPPED']
        }
      }
    });

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);

    // Get pending orders count
    const pendingOrders = await prisma.order.count({
      where: {
        status: 'PENDING'
      }
    });

    // Get low stock products
    const lowStockProducts = await prisma.product.count({
      where: {
        stock: {
          lt: 10
        }
      }
    });

    // Get recent orders (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });

    // Get top selling products
    const orderItems = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    });

    const topProductIds = orderItems.map(item => item.productId);
    const topProducts = await prisma.product.findMany({
      where: {
        id: {
          in: topProductIds
        }
      },
      select: {
        id: true,
        name: true,
        stock: true
      }
    });

    return NextResponse.json({
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        lowStockProducts,
        recentOrders
      },
      topProducts: topProducts.map(product => ({
        ...product,
        sold: orderItems.find(item => item.productId === product.id)?._sum.quantity || 0
      }))
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
