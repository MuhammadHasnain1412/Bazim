import { Container, SimpleGrid, Stack, ActionIcon, Text } from "@mantine/core";
import { IconTruckDelivery, IconShieldCheck, IconRefresh } from "@tabler/icons-react";

export function ValueProposition() {
  return (
    <Container size="xl" py="xl">
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
        <Stack align="center" gap="md">
          <ActionIcon size="xl" variant="light" color="orange">
            <IconTruckDelivery size={32} />
          </ActionIcon>
          <Text fw={600} size="lg">Fast Delivery</Text>
          <Text c="gray.6" ta="center">
            Free shipping on orders over $100
          </Text>
        </Stack>

        <Stack align="center" gap="md">
          <ActionIcon size="xl" variant="light" color="orange">
            <IconShieldCheck size={32} />
          </ActionIcon>
          <Text fw={600} size="lg">Secure Payments</Text>
          <Text c="gray.6" ta="center">
            100% secure payment processing
          </Text>
        </Stack>

        <Stack align="center" gap="md">
          <ActionIcon size="xl" variant="light" color="orange">
            <IconRefresh size={32} />
          </ActionIcon>
          <Text fw={600} size="lg">30-Day Returns</Text>
          <Text c="gray.6" ta="center">
            Easy returns and exchanges
          </Text>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}
