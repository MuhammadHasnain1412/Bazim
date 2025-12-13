"use client";

import {
  Stack,
  Title,
  Button,
  Table,
  Group,
  ActionIcon,
  Badge,
} from "@mantine/core";
import { IconPlus, IconPencil, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { safeLocalStorage } from "@/lib/localStorage";

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
        console.log("Delete request token:", token ? "exists" : "missing");
        
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Delete response status:", response.status);
        
        if (response.ok) {
          fetchProducts();
        } else {
          const errorData = await response.json();
          console.error("Delete failed:", errorData);
          alert(`Delete failed: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      }
    }
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <Title order={2}>Products</Title>
        <Button
          component={Link}
          href="/admin/products/new"
          leftSection={<IconPlus size={18} />}
        >
          Add Product
        </Button>
      </Group>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Stock</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {products.map((product: any) => (
            <Table.Tr key={product.id}>
              <Table.Td>{product.name}</Table.Td>
              <Table.Td>{product.category?.name}</Table.Td>
              <Table.Td>Rs {Number(product.price).toFixed(2)}</Table.Td>
              <Table.Td>{product.stock}</Table.Td>
              <Table.Td>
                <Badge color={product.stock > 0 ? "green" : "red"}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon
                    component={Link}
                    href={`/admin/products/${product.id}/edit`}
                    variant="light"
                    color="blue"
                  >
                    <IconPencil size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => handleDelete(product.id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
