"use client";

import { Container, Title, Stack, TextInput, NumberInput, Select, Button, Textarea, Group, Grid, GridCol, Text, LoadingOverlay } from "@mantine/core";
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
  categoryId: string;
  fabricType: string;
  fabricGSM: string;
  designType: string;
  images: string[];
  colors: string;
  sizes: string;
  featured: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  fabricType: string;
  fabricGSM: string;
  designType: string;
  images: string[];
  colors: string;
  sizes: string;
  featured: boolean;
  category: {
    id: string;
    name: string;
  };
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
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
      categoryId: "",
      fabricType: "",
      fabricGSM: "",
      designType: "",
      images: [],
      colors: "",
      sizes: "",
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
            categoryId: productData.categoryId,
            fabricType: productData.fabricType,
            fabricGSM: productData.fabricGSM,
            designType: productData.designType,
            images: productData.images || [],
            colors: Array.isArray(productData.colors) ? productData.colors.join(", ") : productData.colors,
            sizes: Array.isArray(productData.sizes) ? productData.sizes.join(", ") : productData.sizes,
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
  }, [params, router, form]);

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
          colors: values.colors.split(",").map(color => color.trim()),
          sizes: values.sizes.split(",").map(size => size.trim()),
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
        <LoadingOverlay visible={loading} />
        <Text>Loading product...</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Title order={1}>Edit Product</Title>
        
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
                  label="Category"
                  placeholder="Select category"
                  data={[
                    { value: "shalwar-kameez", label: "Shalwar Kameez" },
                    { value: "kurta", label: "Kurta" },
                    { value: "waistcoat", label: "Waistcoat" },
                    { value: "sherwani", label: "Sherwani" },
                    { value: "pathani-suit", label: "Pathani Suit" },
                    { value: "pant-shirt", label: "Pant Shirt" },
                  ]}
                  {...form.getInputProps("categoryId")}
                  required
                />
                
                <TextInput
                  label="Fabric Type"
                  placeholder="Cotton, Silk, etc."
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
                  <Text size="sm" fw={500} mb="xs">Product Images</Text>
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
                
                <Textarea
                  label="Sizes (comma separated)"
                  placeholder="S, M, L, XL"
                  {...form.getInputProps("sizes")}
                  required
                />
              </Stack>
            </GridCol>
          </Grid>
          
          <Group mt="lg">
            <Button type="submit" color="blue" loading={submitting}>
              Update Product
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