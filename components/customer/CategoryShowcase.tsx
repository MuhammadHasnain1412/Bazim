"use client";

import { Box, Container, SimpleGrid, Text, Title, Stack } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

const categories = [
  {
    id: "summer",
    title: "The Summer Edit",
    description: "Premium Lawn & Cotton",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop",
    link: "/products?category=lawn",
  },
  {
    id: "winter",
    title: "Winter Tales",
    description: "Warm Khaddar & Wool",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
    link: "/products?category=khaddar",
  },
  {
    id: "autumn",
    title: "Autumn Breeze",
    description: "Cambric & Linen",
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a18e47f?q=80&w=1000&auto=format&fit=crop",
    link: "/products?category=cambric",
  },
  {
    id: "spring",
    title: "Spring Festive",
    description: "Luxury Silk & Chiffon",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop",
    link: "/products?category=silk",
  },
];

export function CategoryShowcase() {
  return (
    <Container size="xl" py={80}>
      <Stack gap="xl" mb={50}>
        <Title order={2} size={32} fw={600} ta="center" tt="uppercase" lts={2}>
          Seasonal Collections
        </Title>
        <Text ta="center" c="dimmed" maw={600} mx="auto">
          Discover our exclusive unstitched fabrics curated for every season.
          From breezy summer lawns to cozy winter khaddar.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={30}>
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </SimpleGrid>
    </Container>
  );
}

function CategoryCard({ category }: { category: (typeof categories)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={category.link} style={{ textDecoration: "none" }}>
      <Box
        h={400}
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${category.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "transform 0.6s ease",
            transform: hovered ? "scale(1.1)" : "scale(1)",
          }}
        />

        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%)",
            transition: "opacity 0.3s ease",
            opacity: 0.8,
          }}
        />

        <Box
          style={{
            position: "absolute",
            bottom: 30,
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 2,
          }}
        >
          <Text
            c="white"
            fw={500}
            size="lg"
            tt="uppercase"
            lts={2}
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            {category.title}
          </Text>
          <Text
            c="gray.3"
            size="xs"
            tt="uppercase"
            lts={1}
            mt={4}
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            {category.description}
          </Text>
        </Box>
      </Box>
    </Link>
  );
}
