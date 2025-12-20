"use client";

import { Box, Container, SimpleGrid, Text, Title, Stack } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

const categories = [
  {
    id: "summer",
    title: "Summer Breeze",
    description: "Premium Men's Unstitched Lawn & Cotton",
    image:
      "https://images.unsplash.com/photo-1524234107056-1c1f48f64ab8?q=80&w=1000&auto=format&fit=crop",
    link: "/products?fabric=lawn",
  },
  {
    id: "winter",
    title: "The Winter Edit",
    description: "Authentic Unstitched Khaddar & Wool",
    image:
      "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?q=80&w=1000&auto=format&fit=crop",
    link: "/products?fabric=khaddar",
  },
  {
    id: "formal",
    title: "Signature Silk",
    description: "Luxury Unstitched Embroidered Silk",
    image:
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=1000&auto=format&fit=crop",
    link: "/products?fabric=silk",
  },
  {
    id: "classic",
    title: "Classic Cambric",
    description: "Versatile Mid-Season Unstitched Fabrics",
    image:
      "https://images.unsplash.com/photo-1528459801416-a7e99a0dce3a?q=80&w=1000&auto=format&fit=crop",
    link: "/products?fabric=cambric",
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
