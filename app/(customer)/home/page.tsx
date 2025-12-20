"use client";

import {
  BlogSection,
  BrandShowcase,
  CategoryShowcase,
  FeaturedProductsSection,
  NewsletterSection,
  PromotionalBanner,
  ValueProposition,
} from "@/components/customer";
import {
  Container,
  Stack,
  Title,
  Text,
  Button,
  Image,
  Box,
} from "@mantine/core";

export default function HomePage() {
  return (
    <Box>
      <Box
        style={{
          position: "relative",
          height: "90vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Image
          src="https://picsum.photos/1920/1080?random=hero"
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
            background: "rgba(0,0,0,0.2)", // lighter overlay
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack align="center" gap="lg" c="white">
            <Title
              order={1}
              size={80}
              fw={300}
              ta="center"
              lts={2}
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
            >
              NEW SEASON
            </Title>
            <Text size="xl" ta="center" maw={500} fw={300} lts={1}>
              Elevated essentials for the modern wardrobe.
            </Text>
            <Button
              size="lg"
              variant="white"
              color="dark"
              radius="xl"
              px={40}
              fw={400}
              tt="uppercase"
            >
              Shop Collection
            </Button>
          </Stack>
        </Box>
      </Box>
      <CategoryShowcase />
      <ValueProposition />
      <FeaturedProductsSection />
    </Box>
  );
}
