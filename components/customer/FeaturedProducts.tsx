"use client";

import { Container, Title, Text, Grid } from "@mantine/core";
import { ProductCard, ProductCardProps } from "./ProductCard";

interface FeaturedProductsProps {
  products: ProductCardProps[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Title order={2} ta="center" mb="xl">
          Featured Products
        </Title>
        <Text ta="center" c="dimmed">
          No products avaliable at the moment
        </Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="xl" ta="center">
        Featured Products
      </Title>
      <Grid>
        {products.map((product) => (
          <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 3 }}>
            <ProductCard {...product} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
