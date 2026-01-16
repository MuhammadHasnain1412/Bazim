"use client";

import {
  Container,
  Title,
  Stack,
  TextInput,
  NumberInput,
  Button,
  Textarea,
  Group,
  Grid,
  GridCol,
  Text,
  LoadingOverlay,
  Skeleton,
  Badge,
  Paper,
} from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { safeLocalStorage } from "@/lib/localStorage";

interface EditProductForm {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  fabricType: string;
  images: string[];
  featured: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  fabricType: string;
  images: string[];
  featured: boolean;
  reviews: {
    id: string;
    rating: number;
    comment: string;
    userName: string;
    userEmail: string;
    isActive: boolean;
    createdAt: string;
  }[];
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<EditProductForm>({
    initialValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      stock: 0,
      fabricType: "",
      images: [],
      featured: false,
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { id } = await params;
        const token = safeLocalStorage.getItem("adminToken");

        const response = await fetch(`/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const productData = data.product;

          setProduct(productData);

          form.setValues({
            name: productData.name,
            slug: productData.slug,
            description: productData.description,
            price: Number(productData.price),
            stock: productData.stock,
            fabricType: productData.fabricType,
            images: productData.images?.map((img: any) => img.id) || [],
            featured: productData.featured,
          });
        } else {
          notifications.show({
            title: "Error",
            message: "Failed to fetch product",
            color: "red",
          });
          router.push("/admin/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        notifications.show({
          title: "Error",
          message: "Failed to fetch product",
          color: "red",
        });
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params, router]);

  const handleSubmit = async (values: EditProductForm) => {
    setSubmitting(true);
    try {
      const { id } = await params;
      const token = safeLocalStorage.getItem("adminToken");

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
          price: Number(values.price),
          stock: Number(values.stock),
        }),
      });

      if (response.ok) {
        notifications.show({
          title: "Success",
          message: "Product updated successfully",
          color: "green",
        });
        router.push("/admin/products");
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      notifications.show({
        title: "Error",
        message: "Failed to update product",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Stack gap="lg">
          <Skeleton height={40} width={250} />

          <Grid>
            <GridCol span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <Skeleton height={50} radius="sm" />
                <Skeleton height={50} radius="sm" />
                <Skeleton height={100} radius="sm" />
                <Skeleton height={50} radius="sm" />
                <Skeleton height={50} radius="sm" />
              </Stack>
            </GridCol>

            <GridCol span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <Skeleton height={50} radius="sm" />
                <Skeleton height={50} radius="sm" />
                <Skeleton height={50} radius="sm" />
                <Skeleton height={80} radius="sm" />
                <Skeleton height={80} radius="sm" />
              </Stack>
            </GridCol>
          </Grid>

          <Group mt="lg">
            <Skeleton height={36} width={150} radius="sm" />
            <Skeleton height={36} width={100} radius="sm" />
          </Group>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Title order={1} size="h2" tt="uppercase" lts={1} fw={700}>
          Edit Product
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid>
            <GridCol span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <TextInput
                  label="Product Name"
                  placeholder="Enter product name"
                  {...form.getInputProps("name")}
                  required
                />

                <TextInput
                  label="Slug"
                  placeholder="product-slug"
                  {...form.getInputProps("slug")}
                  required
                />

                <Textarea
                  label="Description"
                  placeholder="Enter product description"
                  {...form.getInputProps("description")}
                  required
                />

                <NumberInput
                  label="Price (Rs)"
                  placeholder="0"
                  {...form.getInputProps("price")}
                  required
                />

                <NumberInput
                  label="Stock"
                  placeholder="0"
                  {...form.getInputProps("stock")}
                  required
                />
              </Stack>
            </GridCol>

            <GridCol span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <TextInput
                  label="Fabric Type"
                  placeholder="Enter fabric type"
                  {...form.getInputProps("fabricType")}
                  required
                />

                <div>
                  <Text size="sm" fw={500} mb="xs">
                    Product Images
                  </Text>
                  <ImageUploader
                    value={form.values.images}
                    onChange={(images) => form.setFieldValue("images", images)}
                    maxImages={5}
                  />
                </div>
              </Stack>
            </GridCol>
          </Grid>

          <Group mt="lg">
            <Button type="submit" loading={submitting}>
              Update Product
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </Group>
        </form>

        <Stack gap="md" mt="xl">
          <Group justify="space-between" align="center">
            <Title order={2} size="h3">
              Product Reviews
            </Title>
            <Badge size="lg" variant="light" color="gray">
              {product?.reviews?.length || 0} Total Reviews
            </Badge>
          </Group>

          {product?.reviews && product.reviews.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      User
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Rating
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        borderBottom: "1px solid #eee",
                        width: "40%",
                      }}
                    >
                      Comment
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Date
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "right",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.reviews.map((review) => (
                    <tr
                      key={review.id}
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <td style={{ padding: "16px" }}>
                        <Stack gap={0}>
                          <Text fw={600} size="sm">
                            {review.userName}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {review.userEmail}
                          </Text>
                        </Stack>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <Group gap={4}>
                          <Text fw={600} size="sm">
                            {review.rating}
                          </Text>
                          <IconStar
                            size={14}
                            fill="#FFD700"
                            color="#FFD700"
                            style={{ marginTop: -2 }}
                          />
                        </Group>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <Text size="sm" lineClamp={2}>
                          {review.comment}
                        </Text>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <Text size="sm" c="gray.6">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Text>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <Badge
                          color={review.isActive ? "green" : "red"}
                          variant="light"
                        >
                          {review.isActive ? "Active" : "Hidden"}
                        </Badge>
                      </td>
                      <td style={{ padding: "16px", textAlign: "right" }}>
                        <Button
                          size="xs"
                          variant="outline"
                          color={review.isActive ? "red" : "green"}
                          onClick={async () => {
                            try {
                              const token =
                                safeLocalStorage.getItem("adminToken");
                              const response = await fetch(
                                `/api/reviews/${review.id}/toggle-status`,
                                {
                                  method: "PATCH",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    isActive: !review.isActive,
                                  }),
                                }
                              );

                              if (response.ok) {
                                notifications.show({
                                  title: "Success",
                                  message: `Review ${
                                    !review.isActive
                                      ? "activated"
                                      : "deactivated"
                                  }`,
                                  color: "green",
                                });
                                // Refresh product data
                                const productResponse = await fetch(
                                  `/api/products/${product.id}`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                );
                                const data = await productResponse.json();
                                setProduct(data.product);
                              } else {
                                throw new Error("Failed to update status");
                              }
                            } catch (error) {
                              notifications.show({
                                title: "Error",
                                message: "Failed to update review status",
                                color: "red",
                              });
                            }
                          }}
                        >
                          {review.isActive ? "Hide" : "Show"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Paper p="xl" withBorder bg="gray.0" ta="center">
              <Text c="dimmed">No reviews yet for this product.</Text>
            </Paper>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
