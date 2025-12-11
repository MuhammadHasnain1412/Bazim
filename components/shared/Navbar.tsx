"use client";

import { Container, Group, Text, Box, Title, ActionIcon, Input } from "@mantine/core";
import { IconSearch, IconUser, IconHeart, IconShoppingCart } from "@tabler/icons-react";
import { useState } from "react";
import Link from "next/link";

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
          <Box bg="white" py="md" style={{ position: "sticky", top: 0, zIndex: 100 }}>
            <Container size="xl">
              <Group justify="space-between" align="center">
                {/* Logo */}
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <Title order={1} size={24} fw={700} c="dark">
                    BAZIM
                  </Title>
                </Link>
    
                {/* Navigation */}
                <Group gap="xl">
                  <Link href="/" style={{ textDecoration: 'none' }}>
                    <Text size="md" fw={500} c="dark">
                      Home
                    </Text>
                  </Link>
                  <Link href="/products" style={{ textDecoration: 'none' }}>
                    <Text size="md" fw={500} c="dark">
                      Shop
                    </Text>
                  </Link>
                </Group>
    
                <Group gap="md">
                  <Link href="/login" style={{ textDecoration: 'none' }}>
                    <ActionIcon variant="subtle" size="lg">
                      <IconUser size={20} />
                    </ActionIcon>
                  </Link>
                  <Link href="/wishlist" style={{ textDecoration: 'none' }}>
                    <ActionIcon variant="subtle" size="lg">
                      <IconHeart size={20} />
                    </ActionIcon>
                  </Link>
                  <Link href="/cart" style={{ textDecoration: 'none' }}>
                    <ActionIcon variant="subtle" size="lg">
                      <IconShoppingCart size={20} />
                    </ActionIcon>
                  </Link>
                </Group>
              </Group>
    
              {/* Search Bar */}
              {searchOpen && (
                <Box mt="md">
                  <Input
                    placeholder="Search products..."
                    size="lg"
                    leftSection={<IconSearch size={18} />}
                  />
                </Box>
              )}
            </Container>
          </Box>
  );

}
