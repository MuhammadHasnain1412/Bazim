import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Title,
  Text,
  Group,
  ActionIcon,
  Input,
  Button,
} from "@mantine/core";
import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTwitter,
} from "@tabler/icons-react";
import Link from "next/link";

export function Footer() {
  return (
    <Box
      component="footer"
      py={60}
      bg="white"
      style={{ borderTop: "1px solid #f0f0f0" }}
    >
      <Container size="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={40}>
          {/* Brand */}
          <Stack gap="sm">
            <Title order={4} size={18} fw={700} lts={1}>
              BAZIM
            </Title>
            <Text size="sm" c="dimmed" lh={1.6}>
              Premium menswear for the discerning gentleman. Quality, style, and
              comfort in every stitch.
            </Text>
            <Group gap="xs">
              <ActionIcon variant="subtle" color="dark" size="md">
                <IconBrandInstagram size={18} stroke={1.5} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="dark" size="md">
                <IconBrandFacebook size={18} stroke={1.5} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="dark" size="md">
                <IconBrandTwitter size={18} stroke={1.5} />
              </ActionIcon>
            </Group>
          </Stack>

          {/* Shop */}
          <Stack gap="sm">
            <Text size="sm" fw={600} tt="uppercase" lts={1}>
              Shop
            </Text>
            <Link
              href="/products?category=new"
              style={{ textDecoration: "none" }}
            >
              <Text
                size="sm"
                c="dimmed"
                style={{ cursor: "pointer", transition: "color 0.2s" }}
              >
                New Arrivals
              </Text>
            </Link>
            <Link
              href="/products?category=best-sellers"
              style={{ textDecoration: "none" }}
            >
              <Text
                size="sm"
                c="dimmed"
                style={{ cursor: "pointer", transition: "color 0.2s" }}
              >
                Best Sellers
              </Text>
            </Link>
            <Link href="/products" style={{ textDecoration: "none" }}>
              <Text
                size="sm"
                c="dimmed"
                style={{ cursor: "pointer", transition: "color 0.2s" }}
              >
                All Products
              </Text>
            </Link>
          </Stack>

          {/* Support */}
          <Stack gap="sm">
            <Text size="sm" fw={600} tt="uppercase" lts={1}>
              Support
            </Text>
            <Link href="/faq" style={{ textDecoration: "none" }}>
              <Text
                size="sm"
                c="dimmed"
                style={{ cursor: "pointer", transition: "color 0.2s" }}
              >
                FAQ
              </Text>
            </Link>
            <Link href="/shipping" style={{ textDecoration: "none" }}>
              <Text
                size="sm"
                c="dimmed"
                style={{ cursor: "pointer", transition: "color 0.2s" }}
              >
                Shipping & Returns
              </Text>
            </Link>
            <Link href="/contact" style={{ textDecoration: "none" }}>
              <Text
                size="sm"
                c="dimmed"
                style={{ cursor: "pointer", transition: "color 0.2s" }}
              >
                Contact Us
              </Text>
            </Link>
          </Stack>

          {/* Newsletter */}
          <Stack gap="sm">
            <Text size="sm" fw={600} tt="uppercase" lts={1}>
              Newsletter
            </Text>
            <Text size="sm" c="dimmed">
              Subscribe to receive updates and exclusive offers.
            </Text>
            <Group gap={8}>
              <Input placeholder="Your email" radius="xs" style={{ flex: 1 }} />
              <Button
                variant="outline"
                color="dark"
                radius="xs"
                tt="uppercase"
                fz="xs"
              >
                Join
              </Button>
            </Group>
          </Stack>
        </SimpleGrid>

        <Group
          justify="space-between"
          mt={60}
          pt="md"
          style={{ borderTop: "1px solid #f5f5f5" }}
        >
          <Text size="xs" c="dimmed">
            © 2024 Bazim Clothing. All rights reserved.
          </Text>
          <Group gap="lg">
            <Text size="xs" c="dimmed" style={{ cursor: "pointer" }}>
              Privacy
            </Text>
            <Text size="xs" c="dimmed" style={{ cursor: "pointer" }}>
              Terms
            </Text>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
