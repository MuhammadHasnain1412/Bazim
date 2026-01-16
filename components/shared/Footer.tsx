import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Group,
  ActionIcon,
  Input,
  Button,
} from "@mantine/core";
import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import Link from "next/link";
import { COMPANY_INFO, COMPANY_CONTACT } from "@/lib/constants";

export function Footer() {
  return (
    <Box
      component="footer"
      py={60}
      bg="white"
      style={{ borderTop: "1px solid #f0f0f0" }}
    >
      <Container size="xl">
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 4 }}
          spacing={40}
          verticalSpacing={40}
        >
          {/* Brand */}
          <Stack gap="md" align="flex-start">
            <Box style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/logo.png?v=11"
                alt="Bazim"
                style={{
                  height: "80px",
                  width: "auto",
                  display: "block",
                  marginTop: "-15px", // Adjust for logo whitespace to align top with text
                  marginLeft: "-10px", // Slight adjustment if logo has left padding
                }}
              />
            </Box>
            <Text size="sm" c="dimmed" lh={1.6} maw={250}>
              {COMPANY_INFO.description}
            </Text>
            <Group gap="xs">
              <ActionIcon
                component="a"
                href="https://www.instagram.com/bazim_fabrics/?__pwa=1"
                target="_blank"
                rel="noopener noreferrer"
                variant="subtle"
                color="gray"
                size="sm"
              >
                <IconBrandInstagram size={16} stroke={1.5} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray" size="sm">
                <IconBrandFacebook size={16} stroke={1.5} />
              </ActionIcon>
              <ActionIcon
                component="a"
                href={`https://wa.me/${COMPANY_CONTACT.phone.replace(
                  /\D/g,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="subtle"
                color="gray"
                size="sm"
              >
                <IconBrandWhatsapp size={16} stroke={1.5} />
              </ActionIcon>
            </Group>
          </Stack>

          {/* Shop */}
          <Stack gap="md">
            <Text
              size="sm"
              fw={700}
              tt="uppercase"
              lts={1}
              h={24}
              style={{ display: "flex", alignItems: "center" }}
            >
              Shop
            </Text>
            <Stack gap="xs">
              <Link href="/products" style={{ textDecoration: "none" }}>
                <Text size="sm" c="dimmed" className="hover-text">
                  New Arrivals
                </Text>
              </Link>
              <Link href="/products" style={{ textDecoration: "none" }}>
                <Text size="sm" c="dimmed" className="hover-text">
                  Best Sellers
                </Text>
              </Link>
              <Link href="/products" style={{ textDecoration: "none" }}>
                <Text size="sm" c="dimmed" className="hover-text">
                  All Products
                </Text>
              </Link>
            </Stack>
          </Stack>

          {/* Support */}
          <Stack gap="md">
            <Text
              size="sm"
              fw={700}
              tt="uppercase"
              lts={1}
              h={24}
              style={{ display: "flex", alignItems: "center" }}
            >
              Support
            </Text>
            <Stack gap="xs">
              <Link href="/faq" style={{ textDecoration: "none" }}>
                <Text size="sm" c="dimmed" className="hover-text">
                  FAQ
                </Text>
              </Link>
              <Link href="/shipping" style={{ textDecoration: "none" }}>
                <Text size="sm" c="dimmed" className="hover-text">
                  Shipping & Returns
                </Text>
              </Link>
              <Link href="/contact" style={{ textDecoration: "none" }}>
                <Text size="sm" c="dimmed" className="hover-text">
                  Contact Us
                </Text>
              </Link>
            </Stack>
          </Stack>

          {/* Newsletter */}
          <Stack gap="md">
            <Text
              size="sm"
              fw={700}
              tt="uppercase"
              lts={1}
              h={24}
              style={{ display: "flex", alignItems: "center" }}
            >
              Newsletter
            </Text>
            <Stack gap="xs">
              <Text size="sm" c="dimmed" lh={1.4}>
                Subscribe to receive updates and exclusive offers.
              </Text>
              <Group gap={8}>
                <Input
                  placeholder="Your email"
                  size="sm"
                  radius="xs"
                  style={{ flex: 1 }}
                />
                <Button
                  variant="filled"
                  color="dark"
                  size="sm"
                  radius="xs"
                  tt="uppercase"
                  fz="xs"
                  fw={600}
                >
                  Join
                </Button>
              </Group>
            </Stack>
          </Stack>
        </SimpleGrid>

        <Group
          justify="space-between"
          mt={60}
          pt="md"
          style={{ borderTop: "1px solid #f5f5f5" }}
        >
          <Text size="xs" c="dimmed">
            © {new Date().getFullYear()} {COMPANY_INFO.name}. All rights
            reserved.
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
