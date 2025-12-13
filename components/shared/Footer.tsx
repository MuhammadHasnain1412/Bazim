import { Box, Container, SimpleGrid, Stack, Title, Text, Group, ActionIcon, Divider, Input, Button } from "@mantine/core";
import {
  IconBrandInstagram,
  IconMail,
} from "@tabler/icons-react";
import Link from "next/link";

export function Footer() {
  return (
    <Box bg="dark" c="white" py="xl">
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
            {/* Company Info */}
            <Stack gap="md">
              <Title order={3} size={20} fw={600} c="white">
                BAZIM
              </Title>
              <Text size="sm" c="gray.4">
                Your premium destination for men's fashion. Quality clothing for the modern gentleman.
              </Text>
              <Group gap="sm">
                <ActionIcon 
                  variant="subtle" 
                  color="gray" 
                  c="white"
                  component="a"
                  href="https://www.instagram.com/bazim_fabrics/?__pwa=1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandInstagram size={18} />
                </ActionIcon>
              </Group>
            </Stack>

            {/* Shop Links */}
            <Stack gap="md">
              <Text fw={600} c="white">Shop</Text>
              <Link href="/products" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Text size="sm" c="gray.4" style={{ cursor: "pointer" }}>
                  All Products
                </Text>
              </Link>
              <Link href="/products?featured=true" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Text size="sm" c="gray.4" style={{ cursor: "pointer" }}>
                  New Arrivals
                </Text>
              </Link>
              <Link href="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Text size="sm" c="gray.4" style={{ cursor: "pointer" }}>
                  Shopping Cart
                </Text>
              </Link>
              <Link href="/wishlist" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Text size="sm" c="gray.4" style={{ cursor: "pointer" }}>
                  Wishlist
                </Text>
              </Link>
            </Stack>

            {/* Customer Service */}
            <Stack gap="md">
              <Text fw={600} c="white">Customer Service</Text>
              <Link href="/checkout" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Text size="sm" c="gray.4" style={{ cursor: "pointer" }}>
                  Checkout
                </Text>
              </Link>
              <Link href="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Text size="sm" c="gray.4" style={{ cursor: "pointer" }}>
                  Shopping Cart
                </Text>
              </Link>
              <Link href="/wishlist" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Text size="sm" c="gray.4" style={{ cursor: "pointer" }}>
                  Wishlist
                </Text>
              </Link>
              <Link href="/products" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Text size="sm" c="gray.4" style={{ cursor: "pointer" }}>
                  Order Tracking
                </Text>
              </Link>
              <Text size="sm" c="gray.4" style={{ cursor: "pointer" }}>
                Contact Us
              </Text>
            </Stack>

            {/* Newsletter */}
            <Stack gap="md">
              <Text fw={600} c="white">Stay Connected</Text>
              <Text size="sm" c="gray.4">
                Get the latest updates on new products and exclusive offers.
              </Text>
              <Input
                placeholder="Your email"
                size="sm"
                leftSection={<IconMail size={14} />}
              />
              <Button size="sm" variant="outline" color="white">
                Subscribe
              </Button>
            </Stack>
          </SimpleGrid>

          <Divider my="xl" color="gray.7" />

          <Group justify="space-between" align="center">
            <Text size="sm" c="gray.4">
              2024 BAZIM. All rights reserved.
            </Text>
            <Group gap="md">
              <Text size="sm" c="gray.4">Privacy Policy</Text>
              <Text size="sm" c="gray.4">Terms of Service</Text>
              <Text size="sm" c="gray.4">Cookie Policy</Text>
            </Group>
          </Group>
        </Container>
      </Box>
  );
}