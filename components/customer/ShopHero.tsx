"use client";

import { Box, Container, Title, Text, Stack } from "@mantine/core";

export function ShopHero() {
  return (
    <Box
      py={100}
      style={{
        position: "relative",
        backgroundImage:
          'url("https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
      }}
    >
      {/* Overlay for legibility */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1,
        }}
      />

      <Container size="xl" style={{ position: "relative", zIndex: 2 }}>
        <Stack gap="xs" align="center" ta="center">
          <Text
            size="xs"
            fw={700}
            tt="uppercase"
            lts={3}
            c="gray.3"
            style={{ letterSpacing: "0.5em" }}
          >
            Curated Collections
          </Text>
          <Title
            order={1}
            size={48}
            fw={800}
            tt="uppercase"
            lts={2}
            style={{ lineHeight: 1.1 }}
          >
            All Products
          </Title>
          <Box w={60} h={2} bg="white" mt="md" mb="md" />
          <Text size="lg" c="gray.2" maw={600} mx="auto" fw={300}>
            Discover our complete range of premium unstitched fabrics, crafted
            for the modern gentleman who values tradition and quality.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
