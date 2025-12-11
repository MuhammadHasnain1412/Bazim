import { Container, Stack, Title, Grid, GridCol, Group, Button } from "@mantine/core";
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { products } from "@/lib/products";

// Get first 4 products for featured section
const featuredProducts = products.slice(0, 4);

export function FeaturedProductsSection() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Title order={2} size={36} fw={600} ta="center">
          New Arrivals
        </Title>

        <Grid>
          {featuredProducts.map((product) => (
            <GridCol key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard {...product} />
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
