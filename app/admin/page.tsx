"use client";

import { Stack, Title, SimpleGrid, Card, Text, Group, Progress, Badge } from "@mantine/core";
import { IconBox, IconShoppingCart, IconUsers, IconCurrencyDollar, IconAlertTriangle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { safeLocalStorage } from "@/lib/localStorage";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: number;
}

interface TopProduct {
  id: string;
  name: string;
  stock: number;
  sold: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    recentOrders: 0,
  });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = safeLocalStorage.getItem("adminToken");
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setTopProducts(data.topProducts);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: IconBox,
      color: "blue",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: IconShoppingCart,
      color: "green",
    },
    {
      title: "Revenue",
      value: `Rs ${stats.totalRevenue.toLocaleString()}`,
      icon: IconCurrencyDollar,
      color: "orange",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: IconUsers,
      color: "red",
    },
  ];

  const additionalStats = [
    {
      title: "Low Stock Products",
      value: stats.lowStockProducts,
      icon: IconAlertTriangle,
      color: "yellow",
      description: "Products with less than 10 units",
    },
    {
      title: "Recent Orders (7 days)",
      value: stats.recentOrders,
      icon: IconShoppingCart,
      color: "cyan",
      description: "Orders placed in the last week",
    },
  ];

  if (loading) {
    return (
      <Stack gap="xl">
        <Title order={2}>Dashboard Overview</Title>
        <Text>Loading dashboard data...</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      <Title order={2}>Dashboard Overview</Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
        {statCards.map((stat) => (
          <Card key={stat.title} padding="lg" withBorder>
            <Group justify="space-between">
              <Stack gap="xs">
                <Text size="sm" c="gray.6">
                  {stat.title}
                </Text>
                <Text size="xl" fw={700}>
                  {stat.value}
                </Text>
              </Stack>
              <stat.icon size={40} stroke={1.5} color={stat.color} />
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {additionalStats.map((stat) => (
          <Card key={stat.title} padding="lg" withBorder>
            <Group justify="space-between">
              <Stack gap="xs">
                <Text size="sm" c="gray.6">
                  {stat.title}
                </Text>
                <Text size="xl" fw={700}>
                  {stat.value}
                </Text>
                {stat.description && (
                  <Text size="xs" c="gray.5">
                    {stat.description}
                  </Text>
                )}
              </Stack>
              <stat.icon size={40} stroke={1.5} color={stat.color} />
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      {topProducts.length > 0 && (
        <Card padding="lg" withBorder>
          <Title order={3} mb="md">Top Selling Products</Title>
          <Stack gap="sm">
            {topProducts.map((product, index) => (
              <Group key={product.id} justify="space-between">
                <Stack gap={0}>
                  <Text size="sm" fw={500}>
                    {index + 1}. {product.name}
                  </Text>
                  <Text size="xs" c="gray.6">
                    Sold: {product.sold} units | Stock: {product.stock}
                  </Text>
                </Stack>
                <Badge 
                  color={product.stock < 10 ? "red" : "green"}
                  variant="light"
                >
                  {product.stock < 10 ? "Low Stock" : "In Stock"}
                </Badge>
              </Group>
            ))}
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
