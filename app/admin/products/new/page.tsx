"use client";

import {
  Container,
  Title,
  Stack,
  TextInput,
  NumberInput,
  Select,
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

interface CreateProductForm {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  fabricType: string;
  fabricGSM: string;
  designType: string;
  images: string[];
  colors: string;
  sizes: string;
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
      fabricGSM: "",
      designType: "",
      images: [],
      colors: "",
      sizes: "",
      featured: false,
    },
  });

  const handleSubmit = async (values: CreateProductForm) => {
    try {
      // First create the product
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          colors: JSON.stringify(
            values.colors.split(",").map((color) => color.trim())
          ),
          sizes: JSON.stringify(
            values.sizes.split(",").map((size) => size.trim())
          ),
        }),
      });

      if (!response.ok) {
        console.error("Failed to create product");
        return;
      }

      const product = await response.json();

      // Then associate the uploaded images with the product
      if (values.images.length > 0) {
        const imageUpdatePromises = values.images.map(async (imageId) => {
          await fetch("/api/upload/associate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imageId: imageId,
              productId: product.id,
            }),
          });
        });

        await Promise.all(imageUpdatePromises);
      }

      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Title order={1}>Create New Product</Title>

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
                <Select
                  label="Fabric Type"
                  placeholder="Select fabric type"
                  data={[
                    { value: "cotton", label: "Cotton" },
                    { value: "lawn", label: "Lawn" },
                    { value: "cambric", label: "Cambric" },
                    { value: "silk", label: "Silk" },
                    { value: "raw-silk", label: "Raw Silk" },
                    { value: "tussar-silk", label: "Tussar Silk" },
                    { value: "dupioni-silk", label: "Dupioni Silk" },
                    { value: "linen", label: "Linen" },
                    { value: "chiffon", label: "Chiffon" },
                    { value: "georgette", label: "Georgette" },
                    { value: "wool", label: "Wool" },
                    { value: "velvet", label: "Velvet" },
                    { value: "khaddar", label: "Khaddar" },
                    { value: "organza", label: "Organza" },
                  ]}
                  {...form.getInputProps("fabricType")}
                  required
                />

                <TextInput
                  label="Fabric GSM"
                  placeholder="180 GSM"
                  {...form.getInputProps("fabricGSM")}
                  required
                />

                <TextInput
                  label="Design Type"
                  placeholder="Plain, Embroidered, etc."
                  {...form.getInputProps("designType")}
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

                <Textarea
                  label="Colors (comma separated)"
                  placeholder="#FFFFFF, #000000, #4169E1"
                  {...form.getInputProps("colors")}
                  required
                />
              </Stack>
            </GridCol>
          </Grid>

          <Group mt="lg">
            <Button type="submit" color="blue">
              Create Product
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </Group>
        </form>
      </Stack>
    </Container>
  );
}
