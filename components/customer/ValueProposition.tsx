import {
  Container,
  SimpleGrid,
  Stack,
  ActionIcon,
  Text,
  Box,
} from "@mantine/core";
import {
  IconTruckDelivery,
  IconShieldCheck,
  IconRefresh,
} from "@tabler/icons-react";

export function ValueProposition() {
  return (
    <Box bg="#fbf9f4" py={60}>
      <Container size="xl">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
          <Stack align="center" gap="md">
            <ActionIcon size="xl" variant="transparent" c="dark">
              <IconTruckDelivery size={32} stroke={1.5} />
            </ActionIcon>
            <Text fw={600} size="lg">
              Fast Delivery
            </Text>
            <Text c="gray.6" ta="center">
              Free shipping on orders over Rs 5,000
            </Text>
          </Stack>

          <Stack align="center" gap="md">
            <ActionIcon size="xl" variant="transparent" c="dark">
              <IconShieldCheck size={32} stroke={1.5} />
            </ActionIcon>
            <Text fw={600} size="lg">
              Secure Payments
            </Text>
            <Text c="gray.6" ta="center">
              100% secure payment processing
            </Text>
          </Stack>

          <Stack align="center" gap="md">
            <ActionIcon size="xl" variant="transparent" c="dark">
              <IconRefresh size={32} stroke={1.5} />
            </ActionIcon>
            <Text fw={600} size="lg">
              30-Day Returns
            </Text>
            <Text c="gray.6" ta="center">
              Easy returns and exchanges
            </Text>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
