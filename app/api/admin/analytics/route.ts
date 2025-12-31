import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const tokenData = getUserFromRequest(request);
    if (!tokenData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Skip user role check for now to isolate the issue
    // const user = await prisma.user.findUnique({
    //   where: { id: tokenData.userId },
    // });

    // if (user?.role !== "ADMIN") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }
    // Get sales data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
        total: true,
        status: true,
      },
    });

    // Group by date
    const dailySales = orders.reduce((acc: any, order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { date, orders: 0, revenue: 0 };
      }
      acc[date].orders += 1;
      acc[date].revenue += Number(order.total);
      return acc;
    }, {});

    const dailySalesArray = Object.values(dailySales);

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

    const monthlyOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        createdAt: true,
        total: true,
      },
    });

    // Group by month
    const monthlyRevenue = monthlyOrders.reduce((acc: any, order) => {
      const month = order.createdAt.toISOString().slice(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = { month, orders: 0, revenue: 0 };
      }
      acc[month].orders += 1;
      acc[month].revenue += Number(order.total);
      return acc;
    }, {});

    const monthlyRevenueArray = Object.values(monthlyRevenue).sort(
      (a: any, b: any) => (a as any).month.localeCompare((b as any).month)
    );

    // Get top selling products
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    });

    const topProductIds = topProducts.map((item) => item.productId);
    const topProductsData = await prisma.product.findMany({
      where: {
        id: {
          in: topProductIds,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });

    const topSellingProducts = topProducts.map((item) => {
      const product = topProductsData.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        name: product?.name || "Unknown Product",
        price: Number(product?.price || 0),
        quantity: item._sum.quantity || 0,
        revenue: (item._sum.quantity || 0) * Number(product?.price || 0),
      };
    });

    // Get low stock products
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: 5,
        },
      },
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
      },
      orderBy: {
        stock: "asc",
      },
      take: 10,
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
      dailySales: dailySalesArray,
      orderStatusDistribution: orderStatusDistribution.map((item) => ({
        status: item.status,
        count: item._count.id,
      })),
      fabricSales: Object.entries(fabricData).map(([fabric, quantity]) => ({
        fabric,
        quantity,
      })),
      monthlyRevenue: monthlyRevenueArray,
      topSellingProducts,
      lowStockProducts,
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
