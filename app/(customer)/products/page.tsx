// app/(customer)/products/page.tsx
import { ProductCard } from "@/components/customer/ProductCard";
import { Container, Grid, GridCol, Stack, Title, Text } from "@mantine/core";
import { products } from "@/lib/products";

export default function ProductsPage() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} size={36} fw={600} mb="sm">
            All Products
          </Title>
          <Text size="lg" c="gray.6">
            Discover our complete collection of men's unstitched clothing
          </Text>
        </div>

        <Grid>
          {products.map((product) => (
            <GridCol
              key={product.id}
              span={{ base: 12, sm: 6, md: 4, lg: 3 }}
            >
              <ProductCard {...product} />
            </GridCol>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
