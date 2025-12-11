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
import { products } from "@/lib/products";

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

  const relatedProducts = products
    .filter(p => p.id !== product.id)
    .slice(0, 2);

  return (
    <Container size="xl" py="xl">
      <Group gap="xs" mb="lg">
        <Text size="sm" c="gray.6">Home</Text>
        <Text size="sm" c="gray.6">/</Text>
        <Text size="sm" c="gray.6">Shop</Text>
        <Text size="sm" c="gray.6">/</Text>
        <Text size="sm" c="gray.6">Shop Details</Text>
      </Group>

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
                Rs. {product.price.toFixed(2)}
              </Text>
              {product.originalPrice && (
                <Text td="line-through" size="lg" c="gray.5">
                  Rs. {product.originalPrice.toFixed(2)}
                </Text>
              )}
            </Group>

            <Group gap="xs">
              <Rating value={product.rating} fractions={2} readOnly />
              <Text size="sm" c="gray.6">({product.reviews} Reviews)</Text>
            </Group>

            <Text c="gray.6">{product.description}</Text>

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
            <Group gap="sm" align="center">
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  width: '100px'
                }}
              >
                <ActionIcon 
                  size="sm" 
                  variant="subtle"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ 
                    border: 'none',
                    borderRadius: '0',
                    height: '36px'
                  }}
                >
                  <IconMinus size={14} />
                </ActionIcon>
                <div 
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '0 8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    borderLeft: '1px solid #dee2e6',
                    borderRight: '1px solid #dee2e6',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff'
                  }}
                >
                  {quantity}
                </div>
                <ActionIcon 
                  size="sm" 
                  variant="subtle"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  style={{ 
                    border: 'none',
                    borderRadius: '0',
                    height: '36px'
                  }}
                >
                  <IconPlus size={14} />
                </ActionIcon>
              </div>
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