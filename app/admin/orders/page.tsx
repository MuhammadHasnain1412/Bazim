"use client";

import { Stack, Title, Table, Badge, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { safeLocalStorage } from "@/lib/localStorage";

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
      await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${safeLocalStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  return (
    <Stack gap="xl">
      <Title order={2}>Orders Management</Title>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order ID</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {orders.map((order: any) => (
            <Table.Tr key={order.id}>
              <Table.Td>{order.id.slice(0, 8)}</Table.Td>
              <Table.Td>{order.user?.name || order.shippingName}</Table.Td>
              <Table.Td>Rs {Number(order.total).toFixed(2)}</Table.Td>
              <Table.Td>
                <Badge color={statusColors[order.status]}>{order.status}</Badge>
              </Table.Td>
              <Table.Td>{new Date(order.createdAt).toLocaleDateString()}</Table.Td>
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
                  w={150}
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
