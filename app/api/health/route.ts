import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "DATABASE_URL is not configured" 
        },
        { status: 500 }
      );
    }

    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check if admin user exists
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" }
    });

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      adminUsers: adminCount,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
