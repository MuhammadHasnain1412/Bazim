"use client";

import {
  Stack,
  Title,
  Button,
  Table,
  Group,
  ActionIcon,
  Badge,
  Text,
  Paper,
} from "@mantine/core";
import { IconPlus, IconPencil, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { safeLocalStorage } from "@/lib/localStorage";
import { notifications } from "@mantine/notifications";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const token = safeLocalStorage.getItem("adminToken");

        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          notifications.show({
            title: "Success",
            message: "Product deleted successfully",
            color: "green",
          });
          fetchProducts();
        } else {
          const errorData = await response.json();
          notifications.show({
            title: "Error",
            message: `Delete failed: ${errorData.error || "Unknown error"}`,
            color: "red",
          });
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        notifications.show({
          title: "Error",
          message: "Error deleting product",
          color: "red",
        });
      }
    }
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <Title order={2} fw={600} lts={1} tt="uppercase" size={24}>
          Products
        </Title>
        <Button
          component={Link}
          href="/admin/products/new"
          leftSection={<IconPlus size={18} />}
          color="dark"
          radius="md"
        >
          Add Product
        </Button>
      </Group>

      <Paper p={0} bg="transparent">
        <Table verticalSpacing="md" withRowBorders={true}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Text size="xs" fw={500} c="dimmed" tt="uppercase" lts={1}>
                  Name
                </Text>
              </Table.Th>
              <Table.Th>
                <Text size="xs" fw={500} c="dimmed" tt="uppercase" lts={1}>
                  Fabric
                </Text>
              </Table.Th>
              <Table.Th>
                <Text size="xs" fw={500} c="dimmed" tt="uppercase" lts={1}>
                  Price
                </Text>
              </Table.Th>
              <Table.Th>
                <Text size="xs" fw={500} c="dimmed" tt="uppercase" lts={1}>
                  Stock
                </Text>
              </Table.Th>
              <Table.Th>
                <Text size="xs" fw={500} c="dimmed" tt="uppercase" lts={1}>
                  Status
                </Text>
              </Table.Th>
              <Table.Th style={{ textAlign: "right" }}>
                <Text size="xs" fw={500} c="dimmed" tt="uppercase" lts={1}>
                  Actions
                </Text>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {products.map((product: any) => (
              <Table.Tr key={product.id}>
                <Table.Td>
                  <Text fw={500} size="sm">
                    {product.name}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" color="gray" size="sm" radius="sm">
                    {product.fabricType || "Premium"}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    Rs {Number(product.price).toFixed(0)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{product.stock}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={product.stock > 0 ? "dark" : "red"}
                    variant="dot"
                    size="sm"
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <Group gap="xs" justify="flex-end">
                    <ActionIcon
                      component={Link}
                      href={`/admin/products/${product.id}/edit`}
                      variant="subtle"
                      color="dark"
                      size="sm"
                    >
                      <IconPencil size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
