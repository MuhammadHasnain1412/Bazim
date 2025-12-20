"use client";

import {
  CategoryShowcase,
  FeaturedProductsSection,
  NewsletterSection,
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
  Group,
  rem,
} from "@mantine/core";

export default function HomePage() {
  return (
    <Box>
      <Box
        style={{
          position: "relative",
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#0d2137",
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Fashion Hero"
          w="100%"
          h="100%"
          style={{
            objectFit: "cover",
            opacity: 0.7,
            filter: "brightness(0.8)",
            transform: "scale(1.05)",
            animation: "slowZoom 20s infinite alternate ease-in-out",
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
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack align="center" gap={30} c="white" px="md">
            <Stack gap={5} align="center">
              <Title
                order={1}
                size={rem(72)}
                fw={900}
                ta="center"
                lts={2}
                tt="uppercase"
                style={{
                  lineHeight: 1,
                  animation: "fadeInUp 1s ease-out 0.2s both",
                }}
              >
                The Art of <br /> Unstitched
              </Title>
            </Stack>

            <Text
              size="xl"
              ta="center"
              maw={600}
              fw={300}
              lts={1}
              c="gray.2"
              style={{ animation: "fadeInUp 1s ease-out 0.4s both" }}
            >
              Experience the finest craftsmanship in men's apparel. Tailored by
              heritage, worn by you.
            </Text>

            <Group
              gap="md"
              mt="xl"
              style={{ animation: "fadeInUp 1s ease-out 0.6s both" }}
            >
              <Button
                variant="white"
                color="dark"
                size="xl"
                radius="0"
                px={50}
                fw={700}
                tt="uppercase"
                lts={2}
                style={{ transition: "all 0.3s ease" }}
                onClick={() => (window.location.href = "/products")}
              >
                Shop Collection
              </Button>
            </Group>
          </Stack>
        </Box>
      </Box>
      <CategoryShowcase />
      <ValueProposition />
      <FeaturedProductsSection />
      <NewsletterSection />
    </Box>
  );
}
