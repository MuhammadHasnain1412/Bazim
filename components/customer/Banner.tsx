"use client";

import {
  Box,
  Button,
  Container,
  Group,
  Text,
  Title,
  Image,
} from "@mantine/core";

export function Banner() {
  return (
    <Box
      style={{
        background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
        color: "white",
        padding: "4rem 0",
        position: "relative",
        overflow: "hidden",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
      }}
    >
      <Container size="xl">
        <Group align="center" justify="space-between" gap="xl">
          {/* Left Side - Text Content */}
          <div style={{ flex: 1, maxWidth: "500px" }}>
            <Text size="lg" c="gray.7" fw={500} mb="sm">
              New Arrival
            </Text>
            <Title order={1} size={48} fw={800} c="dark" mb="lg">
              Hot Fashion Collection
            </Title>
            <Button
              size="lg"
              bg="dark"
              c="white"
              radius="md"
              style={{ alignSelf: "flex-start" }}
            >
              Shop Now
            </Button>
          </div>

          {/* Right Side - Image */}
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <Image
              src="/images/banner-model.png"
              alt="Fashion Model"
              width={400}
              height={400}
              fallbackSrc="https://placehold.co/400x400/e9ecef/666?text=Model"
              style={{ objectFit: "contain" }}
            />
          </div>
        </Group>
      </Container>

      {/* Background Decorations */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "30%",
          left: "5%",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
        }}
      />
    </Box>
  );
}
