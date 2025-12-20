import {
  Container,
  Stack,
  Title,
  SimpleGrid,
  Card,
  Box,
  Image,
} from "@mantine/core";

const brands = [
  { name: "Nike", logo: "https://picsum.photos/100/50?random=10" },
  { name: "Adidas", logo: "https://picsum.photos/100/50?random=11" },
  { name: "Gucci", logo: "https://picsum.photos/100/50?random=12" },
  { name: "Prada", logo: "https://picsum.photos/100/50?random=13" },
  { name: "H&M", logo: "https://picsum.photos/100/50?random=14" },
  { name: "Zara", logo: "https://picsum.photos/100/50?random=15" },
];

export function BrandShowcase() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Title order={2} size={36} tt="uppercase" lts={1} fw={700} ta="center">
          Shop Our Featured Brands
        </Title>

        <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing="lg">
          {brands.map((brand) => (
            <Card
              key={brand.name}
              h={80}
              component="a"
              href="#"
              style={{ textDecoration: "none" }}
              bg="transparent"
              withBorder={false}
            >
              <Box
                h="100%"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  filter: "grayscale(100%)",
                  opacity: 0.7,
                  transition: "all 0.3s",
                }}
              >
                <Image src={brand.logo} alt={brand.name} h={40} fit="contain" />
              </Box>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
