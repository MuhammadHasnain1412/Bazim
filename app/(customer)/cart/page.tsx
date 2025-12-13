"use client";

import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Card,
  Image,
  ActionIcon,
  NumberInput,
  Divider,
  Box,
} from "@mantine/core";
import { IconTrash, IconShoppingCart } from "@tabler/icons-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" gap="xl">
          <IconShoppingCart size={80} stroke={1} color="gray" />
          <Title order={2}>Your cart is empty</Title>
          <Text c="gray.6">Add some products to get started</Text>
          <Button component={Link} href="/products" size="lg">
            Continue Shopping
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        Shopping Cart ({itemCount} items)
      </Title>

      <Group align="flex-start" gap="xl">
        <Box style={{ flex: 1 }}>
          <Stack gap="md">
            {items.map((item) => (
              <Card key={item.id} padding="md" withBorder>
                <Group gap="md" align="flex-start">
                  <Image
                    src={item.image}
                    alt={item.name}
                    height={280}
                    width={280}
                    radius="md"
                    fallbackSrc="https://placehold.co/280x280/e9ecef/666?text=Product"
                  />

                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Text fw={600} size="lg">
                      {item.name}
                    </Text>
                    {item.color && (
                      <Group gap="xs">
                        <Text size="sm" c="gray.6">
                          Color:
                        </Text>
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: item.color,
                            border: "1px solid #ddd",
                          }}
                        />
                      </Group>
                    )}
                    {item.size && (
                      <Text size="sm" c="gray.6">
                        Size: {item.size}
                      </Text>
                    )}
                    <Text size="lg" fw={600}>
                      Rs {Number(item.price).toFixed(2)}
                    </Text>
                  </Stack>

                  <Group gap="md" align="center">
                    <NumberInput
                      value={item.quantity}
                      onChange={(value) => updateQuantity(item.id, Number(value))}
                      min={1}
                      max={10}
                      w={80}
                    />
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Card>
            ))}
          </Stack>
        </Box>

        <Card padding="lg" withBorder style={{ minWidth: 300 }}>
          <Stack gap="md">
            <Title order={3}>Order Summary</Title>
            <Divider />

            <Group justify="space-between">
              <Text>Subtotal</Text>
              <Text fw={600}>Rs {Number(total).toFixed(2)}</Text>
            </Group>

            <Group justify="space-between">
              <Text>Shipping</Text>
              <Text fw={600}>Free</Text>
            </Group>

            <Divider />

            <Group justify="space-between">
              <Text size="lg" fw={600}>
                Total
              </Text>
              <Text size="xl" fw={700}>
                Rs {Number(total).toFixed(2)}
              </Text>
            </Group>

            <Button
              component={Link}
              href="/checkout"
              size="lg"
              fullWidth
              leftSection={<IconShoppingCart size={18} />}
            >
              Proceed to Checkout
            </Button>

            <Button component={Link} href="/products" variant="outline" fullWidth>
              Continue Shopping
            </Button>
          </Stack>
        </Card>
      </Group>
    </Container>
  );
}
