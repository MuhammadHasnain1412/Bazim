import { Box, Container, Stack, Title, Text, Group, Input, Button } from "@mantine/core";
import { IconMail } from "@tabler/icons-react";

export function NewsletterSection() {
  return (
    <Box bg="orange.6" py="xl">
      <Container size="xl">
        <Stack align="center" gap="lg" c="white">
          <Title order={2} size={36} fw={600} ta="center">
            Get 15% Off Your First Order
          </Title>
          <Text size="lg" ta="center" maw={600}>
            Subscribe to our newsletter and stay updated with the latest trends and exclusive offers
          </Text>
          <Group>
            <Input
              placeholder="Enter your email address"
              size="lg"
              w={300}
              leftSection={<IconMail size={18} />}
            />
            <Button size="lg" variant="white" color="dark">
              Subscribe
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}
