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
  TextInput,
  Image,
  Box,
  rem,
  Modal,
  Skeleton,
} from "@mantine/core";
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconSearch,
  IconPackage,
} from "@tabler/icons-react";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { safeLocalStorage } from "@/lib/localStorage";
import { notifications } from "@mantine/notifications";

import { useDisclosure } from "@mantine/hooks";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal state
  const [opened, { open, close }] = useDisclosure(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const openDeleteModal = (id: string, name: string) => {
    setProductToDelete({ id, name });
    open();
  };

  const confirmDeleteWithModal = async () => {
    if (!productToDelete) return;

    const { id, name } = productToDelete;
    close(); // Close modal immediately

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
          title: "Deleted",
          message: `${name} has been removed from inventory`,
          color: "dark",
          radius: "xs",
        });
        fetchProducts();
      } else {
        const text = await response.text();
        let errorMessage = "Unknown error";
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response:", text);
          errorMessage = text || response.statusText;
        }

        notifications.show({
          title: "Error",
          message: `Delete failed: ${errorMessage}`,
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
    } finally {
      setProductToDelete(null);
    }
  };

  return (
    <Stack gap={40} pb={60}>
      <Group justify="space-between" align="flex-end">
        <Stack gap={4}>
          <Title order={1} size={rem(28)} fw={800} lts={1} tt="uppercase">
            Inventory
          </Title>
          <Text c="dimmed" size="sm">
            Manage your unstitched fabric collection
          </Text>
        </Stack>
        <Button
          component={Link}
          href="/admin/products/new"
          leftSection={<IconPlus size={18} />}
          color="black"
          radius="0"
          size="md"
          tt="uppercase"
          lts={1}
          fw={700}
        >
          Add Product
        </Button>
      </Group>

      <Paper
        p="xl"
        radius="md"
        style={{
          border: "1px solid #f1f3f5",
          backgroundColor: "#fff",
        }}
      >
        <Stack gap="xl">
          <TextInput
            placeholder="Search products by name..."
            size="md"
            leftSection={<IconSearch size={18} stroke={1.5} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            variant="filled"
            radius="md"
            maw={400}
          />

          <Table verticalSpacing="md" withRowBorders={true} highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={1}>
                    Product
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={1}>
                    Fabric Type
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={1}>
                    Price
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={1}>
                    Stock
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={1}>
                    Status
                  </Text>
                </Table.Th>
                <Table.Th style={{ textAlign: "right" }}>
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={1}>
                    Actions
                  </Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredProducts.map((product: any) => {
                const images = product.images || [];
                const mainImage = images.length > 0 ? images[0].id : null;

                return (
                  <Table.Tr key={product.id}>
                    <Table.Td>
                      <Group gap="sm">
                        <Box
                          w={48}
                          h={48}
                          bg="gray.1"
                          style={{
                            borderRadius: "8px",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {mainImage ? (
                            <Image
                              src={`/api/upload?id=${mainImage}`}
                              alt={product.name}
                              fit="cover"
                            />
                          ) : (
                            <IconPackage size={20} color="gray" />
                          )}
                        </Box>
                        <Text fw={600} size="sm">
                          {product.name}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="gray" size="sm" radius="sm">
                        {product.fabricType || "Premium"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={700}>
                        Rs {Number(product.price).toLocaleString()}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {product.stock}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={product.stock > 0 ? "green.6" : "red.6"}
                        variant="dot"
                        size="sm"
                        fw={700}
                        tt="uppercase"
                      >
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Group gap="xs" justify="flex-end">
                        <ActionIcon
                          variant="subtle"
                          color="dark"
                          size="md"
                          onClick={() =>
                            router.push(`/admin/products/${product.id}/edit`)
                          }
                        >
                          <IconPencil size={18} stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red.8"
                          size="md"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openDeleteModal(product.id, product.name);
                          }}
                        >
                          <IconTrash size={18} stroke={1.5} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>

          {!loading && filteredProducts.length === 0 && (
            <Stack align="center" py={60} gap="xs">
              <IconSearch size={40} color="gray" stroke={1} />
              <Text c="dimmed" size="sm">
                No products found matching your search.
              </Text>
            </Stack>
          )}

          {loading && (
            <Stack gap="xs">
              {[...Array(5)].map((_, i) => (
                <Group
                  key={i}
                  justify="space-between"
                  p="md"
                  style={{ borderBottom: "1px solid #f1f3f5" }}
                >
                  <Group>
                    <Skeleton height={48} width={48} radius={8} />
                    <Skeleton height={16} width={150} radius="xl" />
                  </Group>
                  <Skeleton height={20} width={100} radius="xl" />
                  <Skeleton height={20} width={80} radius="xl" />
                  <Skeleton height={20} width={60} radius="xl" />
                  <Skeleton height={20} width={80} radius="xl" />
                  <Skeleton height={28} width={60} radius="xl" />
                </Group>
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>

      <Modal opened={opened} onClose={close} title="Confirm Deletion" centered>
        <Text size="sm" mb="lg">
          Are you sure you want to delete{" "}
          <strong>{productToDelete?.name}</strong>? This action cannot be
          undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDeleteWithModal}>
            Delete
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
}
