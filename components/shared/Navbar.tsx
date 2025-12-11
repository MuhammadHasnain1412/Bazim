"use client";

import { Container, Group, Text, Box, Title, ActionIcon, Input } from "@mantine/core";
import { IconSearch, IconUser, IconHeart, IconShoppingCart } from "@tabler/icons-react";
import { useState } from "react";

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
          <Box bg="white" py="md" style={{ position: "sticky", top: 0, zIndex: 100 }}>
            <Container size="xl">
              <Group justify="space-between" align="center">
                {/* Logo */}
                <Title order={1} size={24} fw={700} c="dark">
                  BAZIM
                </Title>
    
                {/* Navigation */}
                <Group gap="xl">
                  <Text size="md" fw={500} style={{ cursor: "pointer" }}>
                    Shop
                  </Text>
                  <Text size="md" fw={500} style={{ cursor: "pointer" }}>
                    Vendors
                  </Text>
                  <Text size="md" fw={500} style={{ cursor: "pointer" }}>
                    Collections
                  </Text>
                  <Text size="md" fw={500} style={{ cursor: "pointer" }}>
                    Blog
                  </Text>
                  <Text size="md" fw={500} style={{ cursor: "pointer" }}>
                    Contact
                  </Text>
                </Group>
    
                {/* Action Icons */}
                <Group gap="md">
                  <ActionIcon
                    variant="subtle"
                    size="lg"
                    onClick={() => setSearchOpen(!searchOpen)}
                  >
                    <IconSearch size={20} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" size="lg">
                    <IconUser size={20} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" size="lg">
                    <IconHeart size={20} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" size="lg">
                    <IconShoppingCart size={20} />
                  </ActionIcon>
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
