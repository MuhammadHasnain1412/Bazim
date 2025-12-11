// app/(customer)/home/page.tsx
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
  Card,
  SimpleGrid,
  Input,
  ActionIcon,
  Divider,
  Box,
} from "@mantine/core";
import {
  IconSearch,
  IconUser,
  IconHeart,
  IconShoppingCart,
  IconTruckDelivery,
  IconShieldCheck,
  IconRefresh,
  IconMail,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandYoutube,
} from "@tabler/icons-react";
import { useState } from "react";
import { ProductCard } from "@/components/customer/ProductCard";

const featuredProducts = [
  {
    id: "1",
    name: "Premium Cotton Shirt",
    price: 89.99,
    originalPrice: 120.0,
    image: "https://picsum.photos/400/500?random=1",
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
    image: "https://picsum.photos/400/500?random=2",
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
    image: "https://picsum.photos/400/500?random=3",
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
    image: "https://picsum.photos/400/500?random=4",
    category: "Accessories",
    inStock: true,
    colors: ["#C0C0C0", "#FFD700"],
    discount: 25,
  },
];

const brands = [
  { name: "Nike", logo: "https://picsum.photos/100/50?random=10" },
  { name: "Adidas", logo: "https://picsum.photos/100/50?random=11" },
  { name: "Gucci", logo: "https://picsum.photos/100/50?random=12" },
  { name: "Prada", logo: "https://picsum.photos/100/50?random=13" },
  { name: "H&M", logo: "https://picsum.photos/100/50?random=14" },
  { name: "Zara", logo: "https://picsum.photos/100/50?random=15" },
];

const blogPosts = [
  {
    id: "1",
    title: "Summer Fashion Trends 2024",
    excerpt: "Discover the hottest trends for this summer season...",
    image: "https://picsum.photos/400/300?random=20",
    date: "2024-01-15",
  },
  {
    id: "2",
    title: "How to Style Your Wardrobe",
    excerpt: "Expert tips on creating versatile outfits...",
    image: "https://picsum.photos/400/300?random=21",
    date: "2024-01-12",
  },
  {
    id: "3",
    title: "Sustainable Fashion Guide",
    excerpt: "Learn about eco-friendly fashion choices...",
    image: "https://picsum.photos/400/300?random=22",
    date: "2024-01-10",
  },
];

export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Box>

      {/* Main Header */}


      {/* Hero Section */}
      <Box style={{ position: "relative" }}>
        <Container size="xl" p={0}>
          <Box h={600} style={{ position: "relative" }}>
            <Image
              src="https://picsum.photos/1920/600?random=hero"
              alt="Hero"
              w="100%"
              h="100%"
              style={{ objectFit: "cover" }}
            />
            <Box
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stack align="center" gap="xl" c="white">
                <Title order={1} size={64} fw={800} ta="center">
                  The New Season Collection
                </Title>
                <Text size="xl" ta="center" maw={600}>
                  Discover our latest premium fashion pieces designed for the modern gentleman
                </Text>
                <Button size="xl" bg="orange.6" c="white" radius="md">
                  Shop Now
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Category Showcase */}
      <Container size="xl" py="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
          <Card h={200} component="a" href="#" style={{ textDecoration: "none" }}>
            <Box
              h="100%"
              bg="gray.1"
              style={{
                backgroundImage: "url(https://picsum.photos/400/200?random=cat1)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <Box
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: "md",
                  background: "rgba(0,0,0,0.7)",
                }}
              >
                <Text c="white" fw={600} size="lg">
                  Men's Wear
                </Text>
              </Box>
            </Box>
          </Card>

          <Card h={200} component="a" href="#" style={{ textDecoration: "none" }}>
            <Box
              h="100%"
              bg="gray.1"
              style={{
                backgroundImage: "url(https://picsum.photos/400/200?random=cat2)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <Box
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: "md",
                  background: "rgba(0,0,0,0.7)",
                }}
              >
                <Text c="white" fw={600} size="lg">
                  Women's Collection
                </Text>
              </Box>
            </Box>
          </Card>

          <Card h={200} component="a" href="#" style={{ textDecoration: "none" }}>
            <Box
              h="100%"
              bg="gray.1"
              style={{
                backgroundImage: "url(https://picsum.photos/400/200?random=cat3)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <Box
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: "md",
                  background: "rgba(0,0,0,0.7)",
                }}
              >
                <Text c="white" fw={600} size="lg">
                  Accessories
                </Text>
              </Box>
            </Box>
          </Card>

          <Card h={200} component="a" href="#" style={{ textDecoration: "none" }}>
            <Box
              h="100%"
              bg="gray.1"
              style={{
                backgroundImage: "url(https://picsum.photos/400/200?random=cat4)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <Box
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: "md",
                  background: "rgba(0,0,0,0.7)",
                }}
              >
                <Text c="white" fw={600} size="lg">
                  Trending Now
                </Text>
              </Box>
            </Box>
          </Card>
        </SimpleGrid>
      </Container>

      {/* Value Proposition */}
      <Container size="xl" py="xl">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
          <Stack align="center" gap="md">
            <ActionIcon size="xl" variant="light" color="orange">
              <IconTruckDelivery size={32} />
            </ActionIcon>
            <Text fw={600} size="lg">Fast Delivery</Text>
            <Text c="gray.6" ta="center">
              Free shipping on orders over $100
            </Text>
          </Stack>

          <Stack align="center" gap="md">
            <ActionIcon size="xl" variant="light" color="orange">
              <IconShieldCheck size={32} />
            </ActionIcon>
            <Text fw={600} size="lg">Secure Payments</Text>
            <Text c="gray.6" ta="center">
              100% secure payment processing
            </Text>
          </Stack>

          <Stack align="center" gap="md">
            <ActionIcon size="xl" variant="light" color="orange">
              <IconRefresh size={32} />
            </ActionIcon>
            <Text fw={600} size="lg">30-Day Returns</Text>
            <Text c="gray.6" ta="center">
              Easy returns and exchanges
            </Text>
          </Stack>
        </SimpleGrid>
      </Container>

      {/* Featured Products */}
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
            <Button variant="outline" size="lg" color="dark">
              View All Products
            </Button>
          </Group>
        </Stack>
      </Container>

      {/* Promotional Banner */}
      <Box py="xl">
        <Container size="xl">
          <Card h={300} radius="md">
            <Box h="100%" style={{ position: "relative" }}>
              <Image
                src="https://picsum.photos/1200/300?random=promo"
                alt="Promotion"
                w="100%"
                h="100%"
                style={{ objectFit: "cover" }}
              />
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 4rem",
                }}
              >
                <Stack gap="lg" c="white" maw={500}>
                  <Title order={1} size={48} fw={800}>
                    UP TO 50% OFF
                  </Title>
                  <Text size="lg">
                    Don't miss our biggest sale of the season. Premium fashion at unbeatable prices.
                  </Text>
                  <Button size="lg" variant="white" color="dark">
                    Explore the Sale
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Card>
        </Container>
      </Box>

      {/* Top Vendors/Brands */}
      <Container size="xl" py="xl">
        <Stack gap="xl">
          <Title order={2} size={36} fw={600} ta="center">
            Shop Our Featured Brands
          </Title>

          <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing="lg">
            {brands.map((brand) => (
              <Card
                key={brand.name}
                h={80}
                component="a"
                href="#"
                style={{ textDecoration: "none" }}
              >
                <Box
                  h="100%"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    h={40}
                    fit="contain"
                  />
                </Box>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      {/* Blog/Inspiration Section */}
      <Container size="xl" py="xl">
        <Stack gap="xl">
          <Title order={2} size={36} fw={600} ta="center">
            Latest From the Lookbook
          </Title>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {blogPosts.map((post) => (
              <Card key={post.id} component="a" href="#" style={{ textDecoration: "none" }}>
                <Card.Section>
                  <Image
                    src={post.image}
                    alt={post.title}
                    h={200}
                    style={{ objectFit: "cover" }}
                  />
                </Card.Section>
                <Stack gap="sm" p="md">
                  <Text fw={600} size="lg" c="dark">
                    {post.title}
                  </Text>
                  <Text size="sm" c="gray.6" lineClamp={2}>
                    {post.excerpt}
                  </Text>
                  <Text size="xs" c="gray.5">
                    {post.date}
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      {/* Newsletter Subscription */}
      <Box bg="orange.6" py="xl">
        <Container size="xl">
          <Stack align="center" gap="lg" c="white">
            <Title order={2} size={36} fw={600} ta="center">
              Get 15% Off Your First Order
            </Title>
            <Text size="lg" ta="center" maw={600}>
              Subscribe to our newsletter and stay updated with the latest trends and exclusive offers
            </Text>
            <Group>
              <Input
                placeholder="Enter your email address"
                size="lg"
                w={300}
                leftSection={<IconMail size={18} />}
              />
              <Button size="lg" variant="white" color="dark">
                Subscribe
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Footer is now handled by layout */}
    </Box>
  );
}
