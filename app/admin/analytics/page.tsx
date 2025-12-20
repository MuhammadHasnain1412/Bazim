"use client";

import {
  Stack,
  Title,
  Card,
  Text,
  Group,
  SimpleGrid,
  Badge,
  Box,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { safeLocalStorage } from "@/lib/localStorage";
import { notifications } from "@mantine/notifications";

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
      newCustomersThisMonth: 0,
    } as CustomerMetrics,
    averageOrderValue: 0,
    totalOrders: 0,
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
      } else {
        notifications.show({
          title: "Error",
          message: "Failed to fetch analytics data",
          color: "red",
        });
      }
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch analytics data",
        color: "red",
      });
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
      <Stack gap="xl" align="center" justify="center" h="50vh">
        <Text c="dimmed" size="sm">
          LOADING DATA...
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap={40} pb={60}>
      <Box>
        <Title order={1} size={28} fw={800} lts={1} tt="uppercase">
          Analytics
        </Title>
        <Text c="dimmed" size="sm" mt={4}>
          Overview of store performance
        </Text>
      </Box>

      <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing={20}>
        <MetricCard
          label="Total Orders"
          value={analyticsData.totalOrders.toString()}
        />
        <MetricCard
          label="Avg. Order Value"
          value={`Rs ${analyticsData.averageOrderValue.toFixed(0)}`}
        />
        <MetricCard
          label="Total Customers"
          value={analyticsData.customerMetrics.totalCustomers.toString()}
        />
        <MetricCard
          label="New Customers (Mo)"
          value={analyticsData.customerMetrics.newCustomersThisMonth.toString()}
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={30}>
        <SectionCard title="Order Status">
          <Stack gap="sm">
            {analyticsData.orderStatusDistribution.map((status) => (
              <Group
                key={status.status}
                justify="space-between"
                py={8}
                style={{ borderBottom: "1px solid #f8f9fa" }}
              >
                <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                  {status.status}
                </Text>
                <Group gap="xs">
                  <Badge color="gray" variant="light" size="sm" radius="sm">
                    {status.count}
                  </Badge>
                  <Text size="xs" c="dimmed" w={40} ta="right">
                    {analyticsData.totalOrders > 0
                      ? `${(
                          (status.count / analyticsData.totalOrders) *
                          100
                        ).toFixed(0)}%`
                      : "0%"}
                  </Text>
                </Group>
              </Group>
            ))}
          </Stack>
        </SectionCard>

        <SectionCard title="Top Categories">
          <Stack gap="sm">
            {analyticsData.categorySales.slice(0, 5).map((category, index) => (
              <Group
                key={category.category}
                justify="space-between"
                py={8}
                style={{ borderBottom: "1px solid #f8f9fa" }}
              >
                <Group gap="md">
                  <Text size="xs" w={10} c="dimmed">
                    0{index + 1}
                  </Text>
                  <Text size="sm" fw={500}>
                    {category.category}
                  </Text>
                </Group>
                <Text size="sm" fw={600}>
                  {category.quantity} units
                </Text>
              </Group>
            ))}
          </Stack>
        </SectionCard>
      </SimpleGrid>

      <SectionCard title="Revenue Trend (Last 6 Months)">
        <Stack gap="sm">
          {analyticsData.monthlyRevenue.map((month) => (
            <Group
              key={month.month}
              justify="space-between"
              py={12}
              style={{ borderBottom: "1px solid #f8f9fa" }}
            >
              <Text size="sm" fw={500}>
                {month.month}
              </Text>
              <Group gap={40}>
                <Text size="sm" c="dimmed">
                  {month.orders} orders
                </Text>
                <Text size="sm" fw={600} w={100} ta="right">
                  Rs {Number(month.revenue).toLocaleString()}
                </Text>
              </Group>
            </Group>
          ))}
        </Stack>
      </SectionCard>
    </Stack>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card padding="lg" radius="md" bg="white" style={{ border: "none" }}>
      <Stack gap={4}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600} lts={1}>
          {label}
        </Text>
        <Text size="xl" fw={700} lts={-0.5} c="dark">
          {value}
        </Text>
      </Stack>
    </Card>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card padding="xl" radius="md" withBorder={false} bg="transparent">
      <Title order={3} size={16} tt="uppercase" lts={1} mb="xl" c="dimmed">
        {title}
      </Title>
      {children}
    </Card>
  );
}
