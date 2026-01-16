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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { safeLocalStorage } from "@/lib/localStorage";
import { notifications } from "@mantine/notifications";

interface CreateProductForm {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  fabricType: string;
  images: string[];
  featured: boolean;
}

export default function NewProductPage() {
  const router = useRouter();

  const form = useForm<CreateProductForm>({
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

  const handleSubmit = async (values: CreateProductForm) => {
    try {
      const token = safeLocalStorage.getItem("adminToken");
      if (!token) {
        notifications.show({
          title: "Error",
          message: "No admin token found. Please login again.",
          color: "red",
        });
        return;
      }

      // First create the product
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        notifications.show({
          title: "Error",
          message: `Failed to create product: ${err.error || "Unknown error"}`,
          color: "red",
        });
        return;
      }

      const { product } = await response.json();

      // Then associate the uploaded images with the product
      if (values.images.length > 0) {
        const imageUpdatePromises = values.images.map(async (imageId) => {
          await fetch("/api/upload/associate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              imageId: imageId,
              productId: product.id,
            }),
          });
        });

        await Promise.all(imageUpdatePromises);
      }

      notifications.show({
        title: "Success",
        message: "Product created successfully",
        color: "green",
      });
      router.push("/admin/products");
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Error creating product",
        color: "red",
      });
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Title order={1} size="h2" tt="uppercase" lts={1} fw={700}>
          Create New Product
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid>
            <GridCol span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <TextInput
                  label="Product Name"
                  placeholder="Enter product name"
                  {...form.getInputProps("name")}
                  onChange={(event) => {
                    const name = event.currentTarget.value;
                    form.setFieldValue("name", name);
                    const slug = name
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "");
                    form.setFieldValue("slug", slug);
                  }}
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
            <Button type="submit" color="dark">
              Create Product
            </Button>
            <Button
              variant="outline"
              color="dark"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </Group>
        </form>
      </Stack>
    </Container>
  );
}
