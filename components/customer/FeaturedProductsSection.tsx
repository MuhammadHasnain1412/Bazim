import { Container, Stack, Title, Grid, GridCol, Group, Button, Text, Skeleton } from "@mantine/core";
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  featured: boolean;
  images: string;
  colors: string;
  sizes: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true');
        const data = await response.json();
        
        if (data.products) {
          // Get first 4 featured products
          setProducts(data.products.slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatProductCard = (product: Product) => {
    const images = JSON.parse(product.images || '[]');
    const colors = JSON.parse(product.colors || '[]');
    
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0] || '/images/testimg.jpeg',
      category: product.category.name,
      inStock: product.stock > 0,
      colors: colors,
      badge: product.featured ? 'Featured' : undefined,
    };
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Stack gap="xl">
          <div>
            <Title order={2} size={24} fw={600} mb="md">
              New Arrivals
            </Title>
            <Text size="lg" c="gray.6">
              Check out our latest collection
            </Text>
          </div>
          <Grid>
            {[...Array(4)].map((_, index) => (
              <GridCol
                key={index}
                span={{ base: 12, sm: 6, md: 3 }}
              >
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
          <Title order={2} size={36} fw={600} ta="center">
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
        <Title order={2} size={36} fw={600} ta="center">
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
          <Link href="/products" style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="lg" color="dark">
              View All Products
            </Button>
          </Link>
        </Group>
      </Stack>
    </Container>
  );
}
