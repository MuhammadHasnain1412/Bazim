"use client";

// app/(customer)/products/page.tsx
import { ProductCard } from "@/components/customer/ProductCard";
import {
  Container,
  Grid,
  GridCol,
  Stack,
  Title,
  Text,
  Skeleton,
  RangeSlider,
  Checkbox,
  Group,
  Divider,
  Button,
  Select,
  Box,
} from "@mantine/core";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { IconFilter, IconSortDescending } from "@tabler/icons-react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  featured: boolean;
  images: { id: string }[];
  colors: string;
  sizes: string;
  fabricType: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<string>("newest");

  const searchParams = useSearchParams();
  const fabricFilter = searchParams.get("fabric");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Fabric Filter
    if (fabricFilter) {
      result = result.filter((p) =>
        p.fabricType?.toLowerCase().includes(fabricFilter.toLowerCase())
      );
    }

    // Price Filter
    result = result.filter(
      (p) =>
        Number(p.price) >= priceRange[0] && Number(p.price) <= priceRange[1]
    );

    // Stock Filter
    if (onlyInStock) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sort
    if (sortBy === "price-low")
      result.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === "price-high")
      result.sort((a, b) => Number(b.price) - Number(a.price));
    if (sortBy === "newest")
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return result;
  }, [products, priceRange, onlyInStock, sortBy]);

  const formatProductCard = (product: Product) => {
    const colors = JSON.parse(product.colors || "[]");
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

  const skeletons = (
    <Container size="xl" py={60}>
      <Grid gutter={40}>
        <GridCol span={{ base: 12, md: 3 }}>
          <Stack gap="xl">
            <Skeleton height={200} radius="md" />
            <Skeleton height={150} radius="md" />
          </Stack>
        </GridCol>
        <GridCol span={{ base: 12, md: 9 }}>
          <Grid gutter="xl">
            {[...Array(6)].map((_, i) => (
              <GridCol key={i} span={{ base: 12, sm: 6, md: 4 }}>
                <Skeleton height={350} radius="md" />
              </GridCol>
            ))}
          </Grid>
        </GridCol>
      </Grid>
    </Container>
  );

  if (loading)
    return (
      <>
        <Box bg="#0d2137" py={60}>
          <Container size="xl">
            <Stack align="center" gap="xs">
              <Title order={1} c="white" tt="uppercase" lts={2} fw={800}>
                Shop Collection
              </Title>
              <Text c="gray.4" size="lg">
                Discover our premium unstitched fabrics
              </Text>
            </Stack>
          </Container>
        </Box>
        {skeletons}
      </>
    );

  return (
    <Box bg="gray.0" style={{ minHeight: "100vh" }}>
      <Box bg="#0d2137" py={60}>
        <Container size="xl">
          <Stack align="center" gap="xs">
            <Title order={1} c="white" tt="uppercase" lts={2} fw={800}>
              Shop Collection
            </Title>
            <Text c="gray.4" size="lg">
              Discover our premium unstitched fabrics
            </Text>
          </Stack>
        </Container>
      </Box>

      <Container size="xl" py={60}>
        <Grid gutter={40}>
          {/* Sidebar Filters */}
          <GridCol span={{ base: 12, md: 3 }}>
            <Stack gap={40} style={{ position: "sticky", top: 100 }}>
              <Box>
                <Group gap="xs" mb="lg">
                  <IconFilter size={18} stroke={1.5} />
                  <Text fw={700} tt="uppercase" lts={1} size="sm">
                    Filters
                  </Text>
                </Group>

                <Stack gap="xl">
                  <Box>
                    <Text fw={600} size="sm" mb="md">
                      Price Range
                    </Text>
                    <RangeSlider
                      min={0}
                      max={50000}
                      step={1000}
                      value={priceRange}
                      onChange={setPriceRange}
                      color="dark"
                      label={(value) => `Rs ${value}`}
                    />
                    <Group justify="space-between" mt="xs">
                      <Text size="xs" c="dimmed">
                        Rs {priceRange[0]}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Rs {priceRange[1]}
                      </Text>
                    </Group>
                  </Box>

                  <Divider color="gray.2" />

                  <Box>
                    <Text fw={600} size="sm" mb="md">
                      Availability
                    </Text>
                    <Checkbox
                      label="In Stock Only"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.currentTarget.checked)}
                      color="dark"
                    />
                  </Box>
                </Stack>
              </Box>

              <Box
                p="xl"
                style={{
                  borderRadius: "8px",
                  border: "1px solid #f1f3f5",
                  backgroundColor: "#fff",
                }}
              >
                <Text fw={700} size="sm" mb="xs" tt="uppercase" lts={1}>
                  Need Assistance?
                </Text>
                <Text size="xs" c="dimmed" mb="md">
                  Our style consultants are available to help you find the
                  perfect piece.
                </Text>
                <Button
                  variant="outline"
                  color="dark"
                  size="xs"
                  fullWidth
                  radius="xl"
                >
                  Contact Us
                </Button>
              </Box>
            </Stack>
          </GridCol>

          {/* Main Content */}
          <GridCol span={{ base: 12, md: 9 }}>
            <Stack gap="xl">
              <Group justify="space-between" align="center">
                <Text size="sm" c="dimmed">
                  Showing{" "}
                  <Text span fw={600} c="dark">
                    {filteredProducts.length}
                  </Text>{" "}
                  products
                </Text>

                <Group gap="xs">
                  <IconSortDescending size={16} color="gray" />
                  <Select
                    size="xs"
                    placeholder="Sort By"
                    value={sortBy}
                    onChange={(val) => setSortBy(val || "newest")}
                    data={[
                      { value: "newest", label: "Newest First" },
                      { value: "price-low", label: "Price: Low to High" },
                      { value: "price-high", label: "Price: High to Low" },
                    ]}
                    variant="unstyled"
                    style={{ width: 150 }}
                  />
                </Group>
              </Group>

              {filteredProducts.length > 0 ? (
                <Grid gutter="xl">
                  {filteredProducts.map((product, index) => (
                    <GridCol key={product.id} span={{ base: 12, sm: 6, md: 4 }}>
                      <ProductCard {...formatProductCard(product)} />
                    </GridCol>
                  ))}
                </Grid>
              ) : (
                <Stack align="center" py={100} gap="md">
                  <Text c="dimmed" size="lg">
                    No products match your selected filters.
                  </Text>
                  <Button
                    variant="subtle"
                    color="dark"
                    onClick={() => {
                      setPriceRange([0, 50000]);
                      setOnlyInStock(false);
                    }}
                  >
                    Clear all filters
                  </Button>
                </Stack>
              )}
            </Stack>
          </GridCol>
        </Grid>
      </Container>
    </Box>
  );
}
