"use client";

import {
  Container,
  Group,
  Text,
  Box,
  Title,
  ActionIcon,
  Indicator,
} from "@mantine/core";
import { IconHeart, IconShoppingCart } from "@tabler/icons-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export function Navbar() {
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();

  return (
    <Box
      component="header"
      py="md"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <Container size="xl">
        <Group justify="space-between" align="center">
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <Title order={1} size={22} fw={800} lts={1} c="dark">
              BAZIM
            </Title>
          </Link>

          {/* Navigation */}
          <Group gap={40} visibleFrom="sm">
            <Link href="/" style={{ textDecoration: "none" }}>
              <Text
                size="sm"
                fw={500}
                c="dark"
                tt="uppercase"
                lts={1}
                style={{ transition: "opacity 0.2s" }}
              >
                Home
              </Text>
            </Link>
            <Link href="/products" style={{ textDecoration: "none" }}>
              <Text
                size="sm"
                fw={500}
                c="dark"
                tt="uppercase"
                lts={1}
                style={{ transition: "opacity 0.2s" }}
              >
                Shop
              </Text>
            </Link>
          </Group>

          <Group gap="xs">
            <Indicator
              label={wishlist.length}
              size={16}
              color="black"
              disabled={wishlist.length === 0}
              offset={4}
              styles={{
                indicator: {
                  fontSize: "10px",
                  fontWeight: 700,
                },
              }}
            >
              <Link href="/wishlist" style={{ textDecoration: "none" }}>
                <ActionIcon variant="transparent" c="dark" size="lg">
                  <IconHeart size={20} stroke={1.5} />
                </ActionIcon>
              </Link>
            </Indicator>

            <Indicator
              label={itemCount}
              size={16}
              color="black"
              disabled={itemCount === 0}
              offset={4}
              styles={{
                indicator: {
                  fontSize: "10px",
                  fontWeight: 700,
                },
              }}
            >
              <Link href="/cart" style={{ textDecoration: "none" }}>
                <ActionIcon variant="transparent" c="dark" size="lg">
                  <IconShoppingCart size={20} stroke={1.5} />
                </ActionIcon>
              </Link>
            </Indicator>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
