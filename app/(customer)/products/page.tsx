"use client";

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
  sizes: string;
  fabricType: string;
  createdAt: string;
  updatedAt: string;
}

import { Suspense } from "react";

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
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
    if (selectedFabrics.length > 0) {
      result = result.filter(
        (p) => p.fabricType && selectedFabrics.includes(p.fabricType)
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
    return result;
  }, [products, priceRange, onlyInStock, sortBy, selectedFabrics]);

  const availableFabrics = useMemo(() => {
    const fabrics = new Set<string>();
    products.forEach((p) => {
      if (p.fabricType) fabrics.add(p.fabricType);
    });
    return Array.from(fabrics).sort();
  }, [products]);

  const formatProductCard = (product: Product) => {
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
        <Container size="xl" pt={60}>
          <Stack align="center" gap="xs">
            <Title
              order={1}
              c="#2c2c2c"
              tt="uppercase"
              lts={{ base: 2, md: 4 }}
              fw={400}
              fz={{ base: 32, md: 48 }}
              ta="center"
              style={{ fontFamily: "Georgia, serif" }}
            >
              All Products
            </Title>
            <Box w={60} h={1} bg="#2c2c2c" mt="xs" />
          </Stack>
        </Container>
        {skeletons}
      </>
    );

  return (
    <Box bg="#fafaf8" style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <Container size="xl" pt={60}>
        <Stack align="center" gap="xs">
          <Title
            order={1}
            c="#2c2c2c"
            tt="uppercase"
            lts={{ base: 2, md: 4 }}
            fw={400}
            fz={{ base: 32, md: 48 }}
            ta="center"
            style={{ fontFamily: "Georgia, serif" }}
          >
            All Products
          </Title>
          <Box w={60} h={1} bg="#2c2c2c" mt="xs" />
        </Stack>
      </Container>

      <Container size="xl" py={60}>
        <Grid gutter={40}>
          {/* Sidebar Filters */}
          <GridCol span={{ base: 12, md: 3 }}>
            <Stack gap={32} style={{ position: "sticky", top: 100 }}>
              <Box>
                <Group gap="xs" mb="lg">
                  <IconFilter size={16} stroke={1.5} color="#2c2c2c" />
                  <Text
                    fw={600}
                    tt="uppercase"
                    lts={1.5}
                    size="xs"
                    c="#2c2c2c"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Filters
                  </Text>
                </Group>

                <Stack gap="xl">
                  <Box>
                    <Text
                      fw={600}
                      size="sm"
                      mb="md"
                      c="#2c2c2c"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Price Range
                    </Text>
                    <RangeSlider
                      min={0}
                      max={50000}
                      step={1000}
                      value={priceRange}
                      onChange={setPriceRange}
                      color="#2c2c2c"
                      label={(value) => `Rs ${value}`}
                      styles={{
                        bar: { backgroundColor: "#2c2c2c" },
                        thumb: { borderColor: "#2c2c2c" },
                      }}
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

                  <Divider color="#e8e6e1" />

                  {/* Fabric Filter */}
                  {availableFabrics.length > 0 && (
                    <>
                      <Box>
                        <Text
                          fw={600}
                          size="sm"
                          mb="md"
                          c="#2c2c2c"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          Fabric Type
                        </Text>
                        <Stack gap="xs">
                          {availableFabrics.map((fabric) => (
                            <Checkbox
                              key={fabric}
                              label={fabric}
                              checked={selectedFabrics.includes(fabric)}
                              onChange={(e) => {
                                if (e.currentTarget.checked) {
                                  setSelectedFabrics([
                                    ...selectedFabrics,
                                    fabric,
                                  ]);
                                } else {
                                  setSelectedFabrics(
                                    selectedFabrics.filter((f) => f !== fabric)
                                  );
                                }
                              }}
                              color="#2c2c2c"
                              styles={{
                                label: { fontFamily: "Georgia, serif" },
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                      <Divider color="#e8e6e1" />
                    </>
                  )}

                  <Box>
                    <Text
                      fw={600}
                      size="sm"
                      mb="md"
                      c="#2c2c2c"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Availability
                    </Text>
                    <Checkbox
                      label="In Stock Only"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.currentTarget.checked)}
                      color="#2c2c2c"
                      styles={{
                        label: { fontFamily: "Georgia, serif" },
                      }}
                    />
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </GridCol>

          {/* Main Content */}
          <GridCol span={{ base: 12, md: 9 }}>
            <Stack gap="xl">
              <Group justify="space-between" align="center">
                <Text
                  size="sm"
                  c="#2c2c2c"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Showing{" "}
                  <Text span fw={600} c="#2c2c2c">
                    {filteredProducts.length}
                  </Text>{" "}
                  products
                </Text>

                <Group gap="xs">
                  <IconSortDescending size={16} color="#2c2c2c" />
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
                    style={{ width: 150, fontFamily: "Georgia, serif" }}
                    styles={{
                      input: { color: "#2c2c2c" },
                    }}
                  />
                </Group>
              </Group>

              {filteredProducts.length > 0 ? (
                <Grid gutter={{ base: 16, md: 30 }}>
                  {filteredProducts.map((product) => (
                    <GridCol key={product.id} span={{ base: 6, md: 4 }}>
                      <ProductCard {...formatProductCard(product)} />
                    </GridCol>
                  ))}
                </Grid>
              ) : (
                <Stack align="center" py={100} gap="md">
                  <Text
                    c="dimmed"
                    size="lg"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    No products match your selected filters.
                  </Text>
                  <Button
                    variant="outline"
                    color="#2c2c2c"
                    radius="0"
                    onClick={() => {
                      setPriceRange([0, 50000]);
                      setOnlyInStock(false);
                      setSelectedFabrics([]);
                    }}
                    styles={{
                      root: {
                        fontFamily: "Georgia, serif",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      },
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div />}>
      <ProductsContent />
    </Suspense>
  );
}
