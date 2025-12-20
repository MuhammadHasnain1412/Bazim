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

  return (
    <Stack gap="xl">
      <Title order={2} fw={600} lts={1} tt="uppercase" size={24}>
        Orders Management
      </Title>

      <Paper p={0} bg="transparent">
        <Table verticalSpacing="md" withRowBorders={true}>
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
      </Paper>
    </Stack>
  );
}
