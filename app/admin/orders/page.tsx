"use client";

import {
  Stack,
  Title,
  Table,
  Badge,
  Select,
  Paper,
  Text,
  Group,
  Skeleton,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { safeLocalStorage } from "@/lib/localStorage";
import { notifications } from "@mantine/notifications";

const statusColors: Record<string, string> = {
  PENDING: "yellow",
  PROCESSING: "blue",
  SHIPPED: "cyan",
  DELIVERED: "green",
  CANCELLED: "red",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${safeLocalStorage.getItem("adminToken")}`,
        },
      });
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${safeLocalStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        notifications.show({
          title: "Order Updated",
          message: `Order #${orderId.slice(0, 8)} status changed to ${status}`,
          color: "green",
        });
        fetchOrders();
      } else {
        throw new Error("Failed to update order");
      }
    } catch (error) {
      console.error("Failed to update order:", error);
      notifications.show({
        title: "Error",
        message: "Failed to update order status",
        color: "red",
      });
    }
  };

  if (loading) {
    return (
      <Stack gap="xl">
        <Skeleton height={29} width={300} mb="xl" />

        {/* Desktop Table Skeleton */}
        <Paper p={0} bg="transparent" visibleFrom="sm">
          <Table verticalSpacing="md" withRowBorders={true}>
            <Table.Thead>
              <Table.Tr>
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Table.Th key={i}>
                      <Skeleton height={16} width={80} />
                    </Table.Th>
                  ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Table.Tr key={i}>
                    <Table.Td>
                      <Skeleton height={20} width={60} />
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={4}>
                        <Skeleton height={20} width={120} />
                        <Skeleton height={14} width={150} />
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={20} width={80} />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={26} width={90} radius="sm" />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={20} width={100} />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={30} width={140} radius="sm" />
                    </Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </Paper>

        {/* Mobile Card Skeleton */}
        <Stack hiddenFrom="sm" gap="md">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Paper key={i} p="md" radius="md" withBorder bg="white">
                <Stack gap="sm">
                  <Group justify="space-between" align="center">
                    <Skeleton height={20} width={60} />
                    <Skeleton height={24} width={80} radius="xl" />
                  </Group>

                  <Stack gap={4}>
                    <Skeleton height={20} width={150} />
                    <Skeleton height={14} width={180} />
                  </Stack>

                  <Group justify="space-between" align="center">
                    <Skeleton height={20} width={80} />
                    <Skeleton height={14} width={100} />
                  </Group>

                  <Skeleton height={30} width="100%" radius="sm" mt="xs" />
                </Stack>
              </Paper>
            ))}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      <Title order={2} fw={600} lts={1} tt="uppercase" size={24}>
        Orders Management
      </Title>

      <Paper p={0} bg="transparent">
        {/* Desktop Table View */}
        <Table verticalSpacing="md" withRowBorders={true} visibleFrom="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Text size="xs" fw={500} c="dimmed" tt="uppercase" lts={1}>
                  Order ID
                </Text>
              </Table.Th>
              <Table.Th>
                <Text size="xs" fw={500} c="dimmed" tt="uppercase" lts={1}>
                  Customer
                </Text>
              </Table.Th>
              <Table.Th>
                <Text size="xs" fw={500} c="dimmed" tt="uppercase" lts={1}>
                  Total
                </Text>
              </Table.Th>
              <Table.Th>
                <Text size="xs" fw={500} c="dimmed" tt="uppercase" lts={1}>
                  Status
                </Text>
              </Table.Th>
              <Table.Th>
                <Text size="xs" fw={500} c="dimmed" tt="uppercase" lts={1}>
                  Date
                </Text>
              </Table.Th>
              <Table.Th>
                <Text size="xs" fw={500} c="dimmed" tt="uppercase" lts={1}>
                  Actions
                </Text>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {orders.map((order: any) => (
              <Table.Tr key={order.id}>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    #{order.id.slice(0, 8)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Stack gap={0}>
                    <Text size="sm" fw={500}>
                      {order.shippingName || order.user?.name || "Guest"}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {order.user?.email || "Guest Order"}
                    </Text>
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    Rs {Number(order.total).toFixed(0)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={statusColors[order.status]}
                    variant="light"
                    size="sm"
                    radius="sm"
                  >
                    {order.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Select
                    value={order.status}
                    onChange={(value) => updateOrderStatus(order.id, value!)}
                    data={[
                      { value: "PENDING", label: "Pending" },
                      { value: "PROCESSING", label: "Processing" },
                      { value: "SHIPPED", label: "Shipped" },
                      { value: "DELIVERED", label: "Delivered" },
                      { value: "CANCELLED", label: "Cancelled" },
                    ]}
                    size="xs"
                    radius="sm"
                    w={140}
                    allowDeselect={false}
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {/* Mobile Card View */}
        <Stack hiddenFrom="sm" gap="md">
          {orders.map((order: any) => (
            <Paper key={order.id} p="md" radius="md" withBorder bg="gray.0">
              <Stack gap="sm">
                <Group justify="space-between" align="center">
                  <Text fw={700} size="sm">
                    #{order.id.slice(0, 8)}
                  </Text>
                  <Badge
                    color={statusColors[order.status]}
                    variant="light"
                    size="sm"
                  >
                    {order.status}
                  </Badge>
                </Group>

                <Stack gap={2}>
                  <Text size="sm" fw={500}>
                    {order.shippingName || order.user?.name || "Guest"}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {order.user?.email || "Guest Order"}
                  </Text>
                </Stack>

                <Group justify="space-between" align="center">
                  <Text fw={600}>Rs {Number(order.total).toFixed(0)}</Text>
                  <Text size="xs" c="dimmed">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                </Group>

                <Select
                  value={order.status}
                  onChange={(value) => updateOrderStatus(order.id, value!)}
                  data={[
                    { value: "PENDING", label: "Pending" },
                    { value: "PROCESSING", label: "Processing" },
                    { value: "SHIPPED", label: "Shipped" },
                    { value: "DELIVERED", label: "Delivered" },
                    { value: "CANCELLED", label: "Cancelled" },
                  ]}
                  size="xs"
                  radius="sm"
                  allowDeselect={false}
                  mt="xs"
                />
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
