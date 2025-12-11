import { Box, Container, SimpleGrid, Stack, Title, Text, Group, ActionIcon, Divider, Input, Button } from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandYoutube,
  IconMail,
} from "@tabler/icons-react";

export function Footer() {
  return (
    <Box bg="dark" c="white" py="xl">
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
            {/* Company Info */}
            <Stack gap="md">
              <Title order={3} size={20} fw={600} c="white">
                BAZIM
              </Title>
              <Text size="sm" c="gray.4">
                Your premium destination for men's fashion. Quality clothing for the modern gentleman.
              </Text>
              <Group gap="sm">
                <ActionIcon variant="subtle" color="gray" c="white">
                  <IconBrandFacebook size={18} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="gray" c="white">
                  <IconBrandTwitter size={18} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="gray" c="white">
                  <IconBrandInstagram size={18} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="gray" c="white">
                  <IconBrandYoutube size={18} />
                </ActionIcon>
              </Group>
            </Stack>

            {/* Quick Links */}
            <Stack gap="md">
              <Text fw={600} c="white">Quick Links</Text>
              <Text size="sm" c="gray.4" style={{ cursor: "pointer" }}>
                About Us
              </Text>
              <Text size="sm" c="gray.4" style={{ cursor: "pointer" }}>
                Careers
              </Text>
              <Text size="sm" c="gray.4" style={{ cursor: "pointer" }}>
                Press
              </Text>
              <Text size="sm" c="gray.4" style={{ cursor: "pointer" }}>
                Blog
              </Text>
            </Stack>

            {/* Customer Service */}
            <Stack gap="md">
              <Text fw={600} c="white">Customer Service</Text>
              <Text size="sm" c="gray.4" style={{ cursor: "pointer" }}>
                FAQ
              </Text>
              <Text size="sm" c="gray.4" style={{ cursor: "pointer" }}>
                Shipping Info
              </Text>
              <Text size="sm" c="gray.4" style={{ cursor: "pointer" }}>
                Returns
              </Text>
              <Text size="sm" c="gray.4" style={{ cursor: "pointer" }}>
                Contact Us
              </Text>
            </Stack>

            {/* Newsletter */}
            <Stack gap="md">
              <Text fw={600} c="white">Stay Connected</Text>
              <Text size="sm" c="gray.4">
                Get the latest updates on new products and exclusive offers.
              </Text>
              <Input
                placeholder="Your email"
                size="sm"
                leftSection={<IconMail size={14} />}
              />
              <Button size="sm" variant="outline" color="white">
                Subscribe
              </Button>
            </Stack>
          </SimpleGrid>

          <Divider my="xl" color="gray.7" />

          <Group justify="space-between" align="center">
            <Text size="sm" c="gray.4">
              © 2024 BAZIM. All rights reserved.
            </Text>
            <Group gap="md">
              <Text size="sm" c="gray.4">Privacy Policy</Text>
              <Text size="sm" c="gray.4">Terms of Service</Text>
              <Text size="sm" c="gray.4">Cookie Policy</Text>
            </Group>
          </Group>
        </Container>
      </Box>
  );
}