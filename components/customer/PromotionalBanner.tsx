import {
  Box,
  Container,
  Card,
  Image,
  Stack,
  Title,
  Text,
  Button,
} from "@mantine/core";

export function PromotionalBanner() {
  return (
    <Box py="xl">
      <Container size="xl">
        <Card h={300} radius="md">
          <Box h="100%" style={{ position: "relative" }}>
            <Image
              src="https://picsum.photos/1200/300?random=promo"
              alt="Promotion"
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
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)",
                display: "flex",
                alignItems: "center",
                padding: "0 4rem",
              }}
            >
              <Stack gap="lg" c="white" maw={500}>
                <Title order={1} size={48} fw={800} tt="uppercase" lts={1}>
                  UP TO 50% OFF
                </Title>
                <Text size="lg">
                  Don't miss our biggest sale of the season. Premium fashion at
                  unbeatable prices.
                </Text>
                <Button size="lg" variant="white" color="dark" tt="uppercase">
                  Explore the Sale
                </Button>
              </Stack>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
