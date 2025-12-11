"use client";

import { Container, Box, Stack, Title, Text, Button, Image } from "@mantine/core";

export function Banner() {
  return (
    <Box style={{ position: "relative" }}>
      <Container size="xl" p={0}>
        <Box h={600} style={{ position: "relative" }}>
          <Image
            src="https://picsum.photos/1920/600?random=hero"
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
              background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack align="center" gap="xl" c="white">
              <Title order={1} size={64} fw={800} ta="center">
                The New Season Collection
              </Title>
              <Text size="xl" ta="center" maw={600}>
                Discover our latest premium fashion pieces designed for the modern gentleman
              </Text>
              <Button size="xl" bg="orange.6" c="white" radius="md">
                Shop Now
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
