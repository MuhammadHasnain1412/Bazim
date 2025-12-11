import { Card, Box, Text, Container, SimpleGrid } from "@mantine/core";

export function CategoryShowcase() {
  return (
    <Container size="xl" py="xl">
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
        <Card h={200} component="a" href="#" style={{ textDecoration: "none" }}>
          <Box
            h="100%"
            bg="gray.1"
            style={{
              backgroundImage: "url(/testimg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            <Box
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: "md",
                background: "rgba(0,0,0,0.7)",
              }}
            >
              <Text c="white" fw={600} size="lg">
                Men's Wear
              </Text>
            </Box>
          </Box>
        </Card>

        <Card h={200} component="a" href="#" style={{ textDecoration: "none" }}>
          <Box
            h="100%"
            bg="gray.1"
            style={{
              backgroundImage: "url(/testimg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            <Box
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: "md",
                background: "rgba(0,0,0,0.7)",
              }}
            >
              <Text c="white" fw={600} size="lg">
                Women's Collection
              </Text>
            </Box>
          </Box>
        </Card>

        <Card h={200} component="a" href="#" style={{ textDecoration: "none" }}>
          <Box
            h="100%"
            bg="gray.1"
            style={{
              backgroundImage: "url(/testimg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            <Box
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: "md",
                background: "rgba(0,0,0,0.7)",
              }}
            >
              <Text c="white" fw={600} size="lg">
                Accessories
              </Text>
            </Box>
          </Box>
        </Card>

        <Card h={200} component="a" href="#" style={{ textDecoration: "none" }}>
          <Box
            h="100%"
            bg="gray.1"
            style={{
              backgroundImage: "url(/testimg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            <Box
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: "md",
                background: "rgba(0,0,0,0.7)",
              }}
            >
              <Text c="white" fw={600} size="lg">
                Trending Now
              </Text>
            </Box>
          </Box>
        </Card>
      </SimpleGrid>
    </Container>
  );
}
