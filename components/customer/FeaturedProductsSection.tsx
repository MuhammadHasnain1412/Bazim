import {
  Container,
  Stack,
  Title,
  Grid,
  GridCol,
  Group,
  Button,
  Text,
  Skeleton,
} from "@mantine/core";
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { useEffect, useState } from "react";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/constants";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  featured: boolean;
  images: { id: string }[];
  colors: string;
  fabricType: string;
  createdAt: string;
  updatedAt: string;
}

export function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products?new=true");
        const data = await response.json();

        if (data.products) {
          // Get first 4 new products
          setProducts(data.products.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatProductCard = (product: Product) => {
    // Check if images is an array (from new API) or string (legacy)
    let images = [];
    if (Array.isArray(product.images)) {
      images = product.images;
    } else {
      images = JSON.parse(product.images || "[]");
    }

    let colors = [];
    try {
      colors = JSON.parse(product.colors || "[]");
    } catch (e) {
      // If parsing fails, it might be a comma-separated string or just a plain string
      if (product.colors) {
        colors = product.colors.includes(",")
          ? product.colors.split(",").map((c) => c.trim())
          : [product.colors];
      }
    }

    // If it's the new format with objects, get the ID. If legacy string array, use it directly (assuming URL).
    // Actually new API returns { id } objects.
    const imageId =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images[0].id
        : null;

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageId ? `/api/upload?id=${imageId}` : "/images/testimg.jpeg",
      fabricType: product.fabricType || "Premium Fabric",
      inStock: product.stock > 0,
      colors: colors,
      badge: product.featured ? "Featured" : undefined,
    };
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Stack gap="xl">
          <div>
            <Title order={2} size={24} tt="uppercase" lts={1} fw={700} mb="md">
              New Arrivals
            </Title>
            <Text size="lg" c="gray.6">
              Check out our latest collection
            </Text>
          </div>
          <Grid>
            {[...Array(4)].map((_, index) => (
              <GridCol key={index} span={{ base: 12, sm: 6, md: 3 }}>
                <Stack gap="md">
                  <Skeleton height={280} radius="md" />
                  <Skeleton height={20} width="80%" />
                  <Skeleton height={24} width="60%" />
                  <Skeleton height={16} width="40%" />
                </Stack>
              </GridCol>
            ))}
          </Grid>
        </Stack>
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Stack gap="xl">
          <Title
            order={2}
            size={36}
            tt="uppercase"
            lts={1}
            fw={700}
            ta="center"
          >
            New Arrivals
          </Title>
          <Text ta="center" c="dimmed">
            No products available at the moment
          </Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Title order={2} size={36} tt="uppercase" lts={1} fw={700} ta="center">
          New Arrivals
        </Title>

        <Grid>
          {products.map((product) => (
            <GridCol key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard {...formatProductCard(product)} />
            </GridCol>
          ))}
        </Grid>

        <Group justify="center">
          <Link href="/products" style={{ textDecoration: "none" }}>
            <Button variant="outline" size="lg" color="dark">
              View All Products
            </Button>
          </Link>
        </Group>
      </Stack>
    </Container>
  );
}
