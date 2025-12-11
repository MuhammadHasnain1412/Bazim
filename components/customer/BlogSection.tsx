import { Container, Stack, Title, SimpleGrid, Card, Image, Text } from "@mantine/core";

const blogPosts = [
  {
    id: "1",
    title: "Summer Fashion Trends 2024",
    excerpt: "Discover the hottest trends for this summer season...",
    image: "https://picsum.photos/400/300?random=20",
    date: "2024-01-15",
  },
  {
    id: "2",
    title: "How to Style Your Wardrobe",
    excerpt: "Expert tips on creating versatile outfits...",
    image: "https://picsum.photos/400/300?random=21",
    date: "2024-01-12",
  },
  {
    id: "3",
    title: "Sustainable Fashion Guide",
    excerpt: "Learn about eco-friendly fashion choices...",
    image: "https://picsum.photos/400/300?random=22",
    date: "2024-01-10",
  },
];

export function BlogSection() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Title order={2} size={36} fw={600} ta="center">
          Latest From the Lookbook
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {blogPosts.map((post) => (
            <Card key={post.id} component="a" href="#" style={{ textDecoration: "none" }}>
              <Card.Section>
                <Image
                  src={post.image}
                  alt={post.title}
                  h={200}
                  style={{ objectFit: "cover" }}
                />
              </Card.Section>
              <Stack gap="sm" p="md">
                <Text fw={600} size="lg" c="dark">
                  {post.title}
                </Text>
                <Text size="sm" c="gray.6" lineClamp={2}>
                  {post.excerpt}
                </Text>
                <Text size="xs" c="gray.5">
                  {post.date}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
