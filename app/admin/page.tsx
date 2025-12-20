"use client";

import {
  Stack,
  Title,
  SimpleGrid,
  Paper,
  Text,
  Group,
  Badge,
} from "@mantine/core";
import {
  IconBox,
  IconShoppingCart,
  IconUsers,
  IconCurrencyDollar,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { safeLocalStorage } from "@/lib/localStorage";
import { notifications } from "@mantine/notifications";

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
      notifications.show({
        title: "Error",
        message: "Failed to fetch dashboard data",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: IconBox,
      color: "gray",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: IconShoppingCart,
      color: "gray",
    },
    {
      title: "Revenue",
      value: `Rs ${stats.totalRevenue.toLocaleString()}`,
      icon: IconCurrencyDollar,
      color: "gray",
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
      color: "red",
      description: "Products with less than 10 units",
    },
    {
      title: "Recent Orders (7 days)",
      value: stats.recentOrders,
      icon: IconShoppingCart,
      color: "blue",
      description: "Orders placed in the last week",
    },
  ];

  if (loading) {
    return (
      <Stack gap="xl">
        <Title order={2} size="h3" tt="uppercase" lts={2} fw={600}>
          Dashboard
        </Title>
        <Text c="dimmed">Loading...</Text>
      </Stack>
    );
  }

  return (
    <Stack gap={60}>
      <Title order={2} size="h2" tt="uppercase" lts={2} fw={600} ta="center">
        Dashboard Overview
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
        {statCards.map((stat) => (
          <Paper key={stat.title} p="xl" bg="white" radius="md">
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" tt="uppercase" lts={1} fw={700}>
                {stat.title}
              </Text>
              <stat.icon
                size={20}
                stroke={1.5}
                color={`var(--mantine-color-${stat.color}-6)`}
              />
            </Group>
            <Text size="xl" fw={300} lts={-1} style={{ fontSize: 32 }}>
              {stat.value}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
        {additionalStats.map((stat) => (
          <Paper key={stat.title} p="xl" bg="white" radius="md">
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" tt="uppercase" lts={1} fw={700}>
                {stat.title}
              </Text>
              <stat.icon
                size={20}
                stroke={1.5}
                color={`var(--mantine-color-${stat.color}-6)`}
              />
            </Group>
            <Text size="xl" fw={300} lts={-1} style={{ fontSize: 32 }}>
              {stat.value}
            </Text>
            {stat.description && (
              <Text size="sm" c="dimmed" mt="xs">
                {stat.description}
              </Text>
            )}
          </Paper>
        ))}
      </SimpleGrid>

      {topProducts.length > 0 && (
        <Stack gap="xl">
          <Title order={3} size="h4" tt="uppercase" lts={1} fw={600}>
            Top Selling Products
          </Title>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
            {topProducts.map((product, index) => (
              <Paper key={product.id} p="lg" bg="white" radius="sm">
                <Group justify="space-between" align="flex-start" mb="md">
                  <Badge variant="light" color="gray" size="sm" radius="sm">
                    #{index + 1}
                  </Badge>
                  <Badge
                    color={product.stock < 10 ? "red" : "gray"}
                    variant="dot"
                    size="sm"
                  >
                    {product.stock < 10 ? "Low Stock" : "In Stock"}
                  </Badge>
                </Group>
                <Text fw={600} size="lg" mb={4}>
                  {product.name}
                </Text>
                <Group gap="xs">
                  <Text size="sm" c="dimmed">
                    Sold:{" "}
                    <Text span c="dark" fw={500}>
                      {product.sold}
                    </Text>
                  </Text>
                  <Text size="sm" c="dimmed">
                    •
                  </Text>
                  <Text size="sm" c="dimmed">
                    Stock:{" "}
                    <Text span c="dark" fw={500}>
                      {product.stock}
                    </Text>
                  </Text>
                </Group>
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>
      )}
    </Stack>
  );
}
