"use client";

import {
  Container,
  Group,
  Stack,
  Title,
  Text,
  Button,
  Badge,
  Image,
  Grid,
  GridCol,
  Rating,
  NumberInput,
  ActionIcon,
  Tabs,
} from "@mantine/core";
import { IconMinus, IconPlus, IconHeart, IconShoppingCart } from "@tabler/icons-react";
import { useState } from "react";
import { ProductCard } from "./ProductCard";

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    inStock: boolean;
    colors: string[];
    badge?: string;
    discount?: number;
    description: string;
    sizes: string[];
    rating: number;
    reviews: number;
    features: string[];
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1]);
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = [
    {
      id: "2",
      name: "Men's Track Jacket",
      price: 45.0,
      image: "https://placehold.co/300x300/4169E1/ffffff?text=Jacket",
      category: "Outerwear",
      inStock: true,
      colors: ["#4169E1", "#000000"],
      badge: "New",
    },
    {
      id: "3",
      name: "Bullet Puffer Jacket",
      price: 85.0,
      originalPrice: 105.0,
      image: "https://placehold.co/300x300/FF6347/ffffff?text=Puffer",
      category: "Winter",
      inStock: true,
      colors: ["#FF6347", "#000000"],
      discount: 20,
    },
  ];

  return (
    <Container size="xl" py="xl">
      {/* Breadcrumbs */}
      <Group gap="xs" mb="lg">
        <Text size="sm" c="gray.6">Home</Text>
        <Text size="sm" c="gray.6">/</Text>
        <Text size="sm" c="gray.6">Shop</Text>
        <Text size="sm" c="gray.6">/</Text>
        <Text size="sm" c="gray.6">Shop Details</Text>
      </Group>

      {/* Product Main Section */}
      <Grid>
        <GridCol span={{ base: 12, md: 6 }}>
          <Image src={product.image} alt={product.name} radius="md" />
        </GridCol>

        <GridCol span={{ base: 12, md: 6 }}>
          <Stack gap="lg">
            {product.badge && (
              <Badge color="red" variant="filled" w="fit-content">
                {product.badge}
              </Badge>
            )}

            <Title order={1} size={32} fw={600}>
              {product.name}
            </Title>

            <Group gap="xs" align="baseline">
              <Text size="xl" fw={600}>
                ${product.price.toFixed(2)}
              </Text>
              {product.originalPrice && (
                <Text td="line-through" size="lg" c="gray.5">
                  ${product.originalPrice.toFixed(2)}
                </Text>
              )}
            </Group>

            <Group gap="xs">
              <Rating value={product.rating} fractions={2} readOnly />
              <Text size="sm" c="gray.6">({product.reviews} Reviews)</Text>
            </Group>

            <Text c="gray.6">{product.description}</Text>

            {/* Size Selection */}
            <Stack gap="sm">
              <Text fw={500}>Select Size</Text>
              <Group gap="xs">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "filled" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </Group>
            </Stack>

            {/* Color Selection */}
            <Stack gap="sm">
              <Text fw={500}>Colors</Text>
              <Group gap="xs">
                {product.colors.map((color) => (
                  <div
                    key={color}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: color.toLowerCase(),
                      border: selectedColor === color ? "2px solid #000" : "1px solid #ddd",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </Group>
            </Stack>

            {/* Quantity and Add to Cart */}
            <Group gap="sm">
              <NumberInput
                value={quantity}
                onChange={(value) => setQuantity(value as number)}
                min={1}
                max={10}
                w={100}
                rightSection={
                  <Group gap={0}>
                    <ActionIcon size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      <IconMinus size={14} />
                    </ActionIcon>
                    <ActionIcon size="sm" onClick={() => setQuantity(Math.min(10, quantity + 1))}>
                      <IconPlus size={14} />
                    </ActionIcon>
                  </Group>
                }
              />
              <Button
                leftSection={<IconShoppingCart size={18} />}
                size="lg"
                style={{ flex: 1 }}
                disabled={!product.inStock}
              >
                Add to Cart
              </Button>
              <ActionIcon size="lg" variant="outline">
                <IconHeart size={18} />
              </ActionIcon>
            </Group>

            {/* Stock Status */}
            <Group gap="xs">
              <Badge color="green" variant="light">In Stock</Badge>
              <Text size="sm" c="gray.6">Delivery and Return</Text>
            </Group>

            {/* Features */}
            <Stack gap="xs">
              {product.features.map((feature, index) => (
                <Text key={index} size="sm">{feature}</Text>
              ))}
            </Stack>
          </Stack>
        </GridCol>
      </Grid>

      {/* Tabs Section */}
      <Tabs defaultValue="description" mt="xl">
        <Tabs.List>
          <Tabs.Tab value="description">Description</Tabs.Tab>
          <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
          <Tabs.Tab value="specification">Specification</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="description" pt="md">
          <Text>{product.description}</Text>
        </Tabs.Panel>

        <Tabs.Panel value="reviews" pt="md">
          <Stack gap="lg">
            <Text fw={500}>Customer Reviews</Text>
            <Text c="gray.6">No reviews yet. Be the first to review!</Text>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="specification" pt="md">
          <Stack gap="sm">
            {product.features.map((feature, index) => (
              <Text key={index} size="sm">{feature}</Text>
            ))}
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* Related Products */}
      <Stack gap="lg" mt="xl">
        <Title order={2}>Related Products</Title>
        <Grid>
          {relatedProducts.map((product) => (
            <GridCol key={product.id} span={{ base: 12, sm: 6, md: 4 }}>
              <ProductCard {...product} />
            </GridCol>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}