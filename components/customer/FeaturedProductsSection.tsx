import { Container, Stack, Title, Grid, GridCol, Group, Button } from "@mantine/core";
import Link from "next/link";
import { ProductCard } from "./ProductCard";

const featuredProducts = [
  {
    id: "1",
    name: "Premium Cotton Shirt",
    price: 89.99,
    originalPrice: 120.0,
    image: "/images/testimg.jpeg",
    category: "Shirts",
    inStock: true,
    colors: ["#FFFFFF", "#000000", "#4169E1"],
    badge: "New",
    discount: 25,
  },
  {
    id: "2",
    name: "Designer Blazer",
    price: 250.0,
    image: "/images/testimg.jpeg",
    category: "Blazers",
    inStock: true,
    colors: ["#000000", "#8B4513"],
    badge: "Exclusive",
  },
  {
    id: "3",
    name: "Casual Denim Jeans",
    price: 79.99,
    originalPrice: 99.99,
    image: "/images/testimg.jpeg",
    category: "Jeans",
    inStock: true,
    colors: ["#4169E1", "#000000"],
    discount: 20,
  },
  {
    id: "4",
    name: "Luxury Watch",
    price: 450.0,
    originalPrice: 600.0,
    image: "/images/testimg.jpeg",
    category: "Accessories",
    inStock: true,
    colors: ["#C0C0C0", "#FFD700"],
    discount: 25,
  },
];

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
