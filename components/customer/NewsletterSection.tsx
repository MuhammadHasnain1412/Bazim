import {
  Box,
  Container,
  Stack,
  Title,
  Text,
  Group,
  Input,
  Button,
} from "@mantine/core";
import { IconMail } from "@tabler/icons-react";

export function NewsletterSection() {
  return (
    <Box bg="#0d2137" py={80}>
      <Container size="xl">
        <Stack align="center" gap="lg" c="white">
          <Title
            order={2}
            size={36}
            tt="uppercase"
            lts={1}
            fw={700}
            ta="center"
          >
            Get 15% Off Your First Order
          </Title>
          <Text size="lg" ta="center" maw={600} fw={300}>
            Subscribe to our newsletter and stay updated with the latest trends
            and exclusive offers
          </Text>
          <Group>
            <Input
              placeholder="Enter your email address"
              size="lg"
              w={300}
              leftSection={<IconMail size={18} />}
              styles={{
                input: {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "white",
                  borderColor: "rgba(255,255,255,0.2)",
                },
              }}
            />
            <Button
              size="lg"
              variant="white"
              color="dark"
              tt="uppercase"
              fw={500}
            >
              Subscribe
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}
