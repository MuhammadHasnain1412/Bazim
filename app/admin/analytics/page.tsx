"use client";

import { Stack, Title, Card, Text, Group, SimpleGrid, Badge } from "@mantine/core";
import { useEffect, useState } from "react";
import { safeLocalStorage } from "@/lib/localStorage";

interface DailySale {
  date: string;
  orders: number;
  revenue: number;
}

interface OrderStatus {
  status: string;
  count: number;
}

interface CategorySale {
  category: string;
  quantity: number;
}

interface MonthlyRevenue {
  month: string;
  orders: number;
  revenue: number;
}

interface CustomerMetrics {
  totalCustomers: number;
  newCustomersThisMonth: number;
}

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState({
    dailySales: [] as DailySale[],
    orderStatusDistribution: [] as OrderStatus[],
    categorySales: [] as CategorySale[],
    monthlyRevenue: [] as MonthlyRevenue[],
    customerMetrics: {
      totalCustomers: 0,
      newCustomersThisMonth: 0
    } as CustomerMetrics,
    averageOrderValue: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const token = safeLocalStorage.getItem("adminToken");
      const response = await fetch("/api/admin/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: "yellow",
    PROCESSING: "blue",
    SHIPPED: "cyan",
    DELIVERED: "green",
    CANCELLED: "red",
  };

  if (loading) {
    return (
      <Stack gap="xl">
        <Title order={2}>Analytics</Title>
        <Text>Loading analytics data...</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      <Title order={2}>Analytics Dashboard</Title>

      <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="lg">
        <Card padding="lg" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="gray.6">Total Orders</Text>
            <Text size="xl" fw={700}>{analyticsData.totalOrders}</Text>
          </Stack>
        </Card>

        <Card padding="lg" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="gray.6">Average Order Value</Text>
            <Text size="xl" fw={700}>Rs {analyticsData.averageOrderValue.toFixed(2)}</Text>
          </Stack>
        </Card>

        <Card padding="lg" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="gray.6">Total Customers</Text>
            <Text size="xl" fw={700}>{analyticsData.customerMetrics.totalCustomers}</Text>
          </Stack>
        </Card>

        <Card padding="lg" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="gray.6">New Customers (This Month)</Text>
            <Text size="xl" fw={700}>{analyticsData.customerMetrics.newCustomersThisMonth}</Text>
          </Stack>
        </Card>
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        <Card padding="lg" withBorder>
          <Title order={3} mb="md">Order Status Distribution</Title>
          <Stack gap="sm">
            {analyticsData.orderStatusDistribution.map((status) => (
              <Group key={status.status} justify="space-between">
                <Text size="sm">{status.status}</Text>
                <Group gap="xs">
                  <Badge color={statusColors[status.status]} variant="light">
                    {status.count}
                  </Badge>
                  <Text size="xs" c="gray.6">
                    {analyticsData.totalOrders > 0 
                      ? `${((status.count / analyticsData.totalOrders) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </Text>
                </Group>
              </Group>
            ))}
          </Stack>
        </Card>

        <Card padding="lg" withBorder>
          <Title order={3} mb="md">Top Categories by Sales</Title>
          <Stack gap="sm">
            {analyticsData.categorySales.slice(0, 5).map((category, index) => (
              <Group key={category.category} justify="space-between">
                <Text size="sm">{index + 1}. {category.category}</Text>
                <Badge color="blue" variant="light">
                  {category.quantity} units
                </Badge>
              </Group>
            ))}
          </Stack>
        </Card>
      </SimpleGrid>

      <Card padding="lg" withBorder>
        <Title order={3} mb="md">Monthly Revenue Trend (Last 6 Months)</Title>
        <Stack gap="sm">
          {analyticsData.monthlyRevenue.map((month) => (
            <Group key={month.month} justify="space-between">
              <Text size="sm">{month.month}</Text>
              <Group gap="md">
                <Text size="sm" c="gray.6">{month.orders} orders</Text>
                <Text size="sm" fw={500}>Rs {Number(month.revenue).toLocaleString()}</Text>
              </Group>
            </Group>
          ))}
        </Stack>
      </Card>

      <Card padding="lg" withBorder>
        <Title order={3} mb="md">Recent Daily Sales (Last 10 Days)</Title>
        <Stack gap="sm">
          {analyticsData.dailySales.slice(-10).map((day) => (
            <Group key={day.date} justify="space-between">
              <Text size="sm">{new Date(day.date).toLocaleDateString()}</Text>
              <Group gap="md">
                <Text size="sm" c="gray.6">{day.orders} orders</Text>
                <Text size="sm" fw={500}>Rs {Number(day.revenue).toLocaleString()}</Text>
              </Group>
            </Group>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
