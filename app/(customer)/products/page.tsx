// app/(customer)/products/page.tsx
import { ProductCard } from "@/components/customer/ProductCard";
import { Container, Grid, GridCol, Stack, Title, Text } from "@mantine/core";

const allProducts = [
  {
    id: "1",
    name: "Hooded Cotton Sweatshirt",
    price: 35.0,
    originalPrice: 45.0,
    image: "/images/testimg.jpeg",
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
    image: "/images/testimg.jpeg",
    category: "Casual",
    inStock: true,
    colors: ["#FFFFFF", "#F5F5DC", "#E6E6FA"],
  },
  {
    id: "3",
    name: "Denim Jacket",
    price: 75.0,
    originalPrice: 95.0,
    image: "/images/testimg.jpeg",
    category: "Outerwear",
    inStock: true,
    colors: ["#4169E1", "#000080", "#483D8B"],
    discount: 20,
  },
  {
    id: "4",
    name: "Striped Polo Shirt",
    price: 40.0,
    image: "/images/testimg.jpeg",
    category: "Casual",
    inStock: false,
    colors: ["#FF6347", "#000000", "#FFFFFF"],
    badge: "Sale",
  },
  {
    id: "5",
    name: "Leather Boots",
    price: 120.0,
    image: "/images/testimg.jpeg",
    category: "Footwear",
    inStock: true,
    colors: ["#8B4513", "#000000"],
  },
  {
    id: "6",
    name: "Wool Sweater",
    price: 65.0,
    originalPrice: 85.0,
    image: "/images/testimg.jpeg",
    category: "Winter",
    inStock: true,
    colors: ["#708090", "#2F4F4F", "#800080"],
    discount: 25,
  },
];

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
          {allProducts.map((product) => (
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
