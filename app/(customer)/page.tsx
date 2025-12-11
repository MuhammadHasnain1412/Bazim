// app/(customer)/page.tsx
import { Banner } from "@/components/customer";
import { ProductCard } from "@/components/customer/ProductCard";
import { Container, Grid, GridCol, Stack, Title, Button } from "@mantine/core";
import { redirect } from "next/navigation";

const sampleProducts = [
  {
    id: "1",
    name: "Hooded Cotton Sweatshirt",
    price: 35.0,
    originalPrice: 45.0,
    image: "https://placehold.co/300x300/000000/ffffff?text=Sweatshirt",
    category: "Casual",
    inStock: true,
    colors: ["#000000", "#8B4513", "#191970"],
    badge: "New",
    discount: 15,
  },
  {
    id: "2",
    name: "Classic White T-Shirt",
    price: 25.0,
    image: "https://placehold.co/300x300/ffffff/000000?text=T-Shirt",
    category: "Casual",
    inStock: true,
    colors: ["#FFFFFF", "#F5F5DC", "#E6E6FA"],
  },
  {
    id: "3",
    name: "Denim Jacket",
    price: 75.0,
    originalPrice: 95.0,
    image: "https://placehold.co/300x300/4169E1/ffffff?text=Denim",
    category: "Outerwear",
    inStock: true,
    colors: ["#4169E1", "#000080", "#483D8B"],
    discount: 20,
  },
  {
    id: "4",
    name: "Striped Polo Shirt",
    price: 40.0,
    image: "https://placehold.co/300x300/FF6347/ffffff?text=Polo",
    category: "Casual",
    inStock: false,
    colors: ["#FF6347", "#000000", "#FFFFFF"],
    badge: "Sale",
  },
];

export default function HomePage() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Banner />

        <div>
          <Title order={2} size={32} fw={600} mb="lg">
            Featured Products
          </Title>

          <Grid>
            {sampleProducts.map((product) => (
              <GridCol
                key={product.id}
                span={{ base: 12, sm: 6, md: 4, lg: 3 }}
              >
                <ProductCard {...product} />
              </GridCol>
            ))}
          </Grid>

          {/* View All Products Button */}
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Button
              size="lg"
              variant="outline"
              color="dark"
              component="a"
              href="/products"
              style={{
                padding: "12px 32px",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              View All Products
            </Button>
          </div>
        </div>
      </Stack>
    </Container>
);
    // redirect("/home");
}