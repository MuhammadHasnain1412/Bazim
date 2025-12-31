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
  Skeleton,
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

interface FabricSale {
  fabric: string;
  quantity: number;
}

interface MonthlyRevenue {
  month: string;
  orders: number;
  revenue: number;
}

interface TopSellingProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  revenue: number;
}

interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  price: number;
}

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState({
    dailySales: [] as DailySale[],
    orderStatusDistribution: [] as OrderStatus[],
    fabricSales: [] as FabricSale[],
    monthlyRevenue: [] as MonthlyRevenue[],
    topSellingProducts: [] as TopSellingProduct[],
    lowStockProducts: [] as LowStockProduct[],
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
      <Box
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <Stack gap="xl" align="center">
          <Skeleton height={40} width={200} />
          <Skeleton height={20} width={150} />
        </Stack>
      </Box>
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
          label="Low Stock Items"
          value={analyticsData.lowStockProducts.length.toString()}
        />
        <MetricCard
          label="Top Products"
          value={analyticsData.topSellingProducts.length.toString()}
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

        <SectionCard title="Top Fabrics">
          <Stack gap="sm">
            {analyticsData.fabricSales.slice(0, 5).map((fabric, index) => (
              <Group
                key={fabric.fabric}
                justify="space-between"
                py={8}
                style={{ borderBottom: "1px solid #f8f9fa" }}
              >
                <Group gap="md">
                  <Text size="xs" w={10} c="dimmed">
                    0{index + 1}
                  </Text>
                  <Text size="sm" fw={500}>
                    {fabric.fabric}
                  </Text>
                </Group>
                <Text size="sm" fw={600}>
                  {fabric.quantity} units
                </Text>
              </Group>
            ))}
          </Stack>
        </SectionCard>
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={30}>
        <SectionCard title="Top Selling Products">
          <Stack gap="sm">
            {analyticsData.topSellingProducts.map((product, index) => (
              <Group
                key={product.productId}
                justify="space-between"
                py={8}
                style={{ borderBottom: "1px solid #f8f9fa" }}
              >
                <Group gap="md">
                  <Text size="xs" w={10} c="dimmed">
                    {index + 1}
                  </Text>
                  <Text size="sm" fw={500}>
                    {product.name}
                  </Text>
                </Group>
                <Group gap={40}>
                  <Text size="sm" c="dimmed">
                    {product.quantity} sold
                  </Text>
                  <Text size="sm" fw={600} w={100} ta="right">
                    Rs {product.revenue.toLocaleString()}
                  </Text>
                </Group>
              </Group>
            ))}
          </Stack>
        </SectionCard>

        <SectionCard title="Low Stock Alert">
          <Stack gap="sm">
            {analyticsData.lowStockProducts.map((product, index) => (
              <Group
                key={product.id}
                justify="space-between"
                py={8}
                style={{ borderBottom: "1px solid #f8f9fa" }}
              >
                <Group gap="md">
                  <Text size="xs" w={10} c="dimmed">
                    {index + 1}
                  </Text>
                  <Text size="sm" fw={500}>
                    {product.name}
                  </Text>
                </Group>
                <Group gap={40}>
                  <Text size="sm" c="dimmed">
                    Stock: {product.stock}
                  </Text>
                  <Text size="sm" fw={600} w={100} ta="right">
                    Rs {Number(product.price).toLocaleString()}
                  </Text>
                </Group>
              </Group>
            ))}
          </Stack>
        </SectionCard>
      </SimpleGrid>
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
