"use client";

import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Image,
  ActionIcon,
  NumberInput,
  Divider,
  Box,
  SimpleGrid,
} from "@mantine/core";
import {
  IconTrash,
  IconShoppingCart,
  IconArrowRight,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, itemCount, isLoaded } =
    useCart();

  if (!isLoaded) {
    return null; // Or a LoadingOverlay
  }

  if (items.length === 0) {
    return (
      <Container size="sm" py={120}>
        <Stack align="center" gap="xl" ta="center">
          <Box
            p={30}
            style={{
              borderRadius: "50%",
              background: "var(--mantine-color-gray-0)",
            }}
          >
            <IconShoppingCart
              size={48}
              stroke={1}
              color="var(--mantine-color-gray-4)"
            />
          </Box>
          <Stack gap="xs">
            <Title order={2} fw={700} tt="uppercase" lts={2}>
              Your basket is empty
            </Title>
            <Text c="dimmed" size="sm">
              Looks like you haven't added anything to your collection yet.
            </Text>
          </Stack>
          <Button
            component={Link}
            href="/products"
            variant="filled"
            color="black"
            size="lg"
            radius="0"
            tt="uppercase"
            lts={2}
            fw={600}
            mt="md"
          >
            Explore Collection
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py={80}>
      <Stack gap={60}>
        <Box>
          <Title
            order={1}
            size={32}
            tt="uppercase"
            lts={3}
            fw={800}
            ta="center"
          >
            Shopping Basket
          </Title>
          <Text ta="center" c="dimmed" size="xs" tt="uppercase" lts={1} mt={8}>
            {itemCount} {itemCount === 1 ? "Item" : "Items"} in your collection
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing={60}>
          {/* Cart Items List */}
          <Box style={{ gridColumn: "span 2" }}>
            <Stack gap={0}>
              <Divider mb="xl" color="gray.2" />
              {items.map((item) => (
                <Box key={item.id} mb="xl">
                  <Group
                    justify="space-between"
                    align="flex-start"
                    wrap="nowrap"
                  >
                    <Group gap="xl" align="flex-start" style={{ flex: 1 }}>
                      <Box
                        bg="gray.0"
                        style={{
                          width: 140,
                          aspectRatio: "3/4",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          h="100%"
                          w="100%"
                          fit="cover"
                        />
                      </Box>

                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Box>
                          <Text
                            fw={700}
                            size="lg"
                            tt="uppercase"
                            lts={1}
                            component={Link}
                            href={`/products/${item.productId}`}
                            c="dark"
                            style={{ textDecoration: "none" }}
                          >
                            {item.name}
                          </Text>
                          <Text
                            size="xs"
                            c="dimmed"
                            tt="uppercase"
                            lts={0.5}
                            mt={4}
                          >
                            Unstitched Collection
                          </Text>
                        </Box>

                        {item.color && (
                          <Group gap="xs" mt={4}>
                            <Text size="xs" c="dimmed" tt="uppercase" lts={1}>
                              Color:
                            </Text>
                            <Box
                              style={{
                                width: 14,
                                height: 14,
                                borderRadius: "50%",
                                backgroundColor: item.color,
                                border: "1px solid rgba(0,0,0,0.1)",
                              }}
                            />
                          </Group>
                        )}

                        <Text fw={700} size="md" mt="auto">
                          Rs {Number(item.price).toLocaleString()}
                        </Text>
                      </Stack>
                    </Group>

                    <Stack
                      align="flex-end"
                      justify="space-between"
                      style={{ height: 140 }}
                    >
                      <ActionIcon
                        variant="transparent"
                        color="gray.4"
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          "&:hover": { color: "var(--mantine-color-red-6)" },
                        }}
                      >
                        <IconTrash size={20} stroke={1.5} />
                      </ActionIcon>

                      <Group
                        gap={5}
                        style={{
                          border: "1px solid var(--mantine-color-gray-2)",
                          padding: "4px",
                        }}
                      >
                        <ActionIcon
                          variant="transparent"
                          color="dark"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <IconMinus size={14} />
                        </ActionIcon>
                        <Text size="sm" fw={600} w={30} ta="center">
                          {item.quantity}
                        </Text>
                        <ActionIcon
                          variant="transparent"
                          color="dark"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <IconPlus size={14} />
                        </ActionIcon>
                      </Group>
                    </Stack>
                  </Group>
                  <Divider mt="xl" color="gray.1" />
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Sticky Summary Sidebar */}
          <Box style={{ position: "sticky", top: 120 }}>
            <Box p={40} bg="gray.0" style={{ border: "1px solid transparent" }}>
              <Title
                order={3}
                size="h4"
                tt="uppercase"
                lts={2}
                fw={800}
                mb={30}
              >
                Order Summary
              </Title>

              <Stack gap="md">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed" tt="uppercase" lts={1}>
                    Subtotal
                  </Text>
                  <Text fw={600}>Rs {Number(total).toLocaleString()}</Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm" c="dimmed" tt="uppercase" lts={1}>
                    Shipping
                  </Text>
                  <Text fw={600} size="sm" tt="uppercase" color="gray.6">
                    Calculated at checkout
                  </Text>
                </Group>

                <Divider my="sm" color="gray.2" />

                <Group justify="space-between">
                  <Text size="md" fw={800} tt="uppercase" lts={1}>
                    Total
                  </Text>
                  <Text size="xl" fw={800}>
                    Rs {Number(total).toLocaleString()}
                  </Text>
                </Group>

                <Stack gap="sm" mt={30}>
                  <Button
                    component={Link}
                    href="/checkout"
                    variant="filled"
                    color="black"
                    size="xl"
                    radius="0"
                    tt="uppercase"
                    lts={2}
                    fw={700}
                    rightSection={<IconArrowRight size={18} />}
                    style={{ height: 60 }}
                  >
                    Checkout
                  </Button>

                  <Button
                    component={Link}
                    href="/products"
                    variant="transparent"
                    color="gray.6"
                    size="sm"
                    tt="uppercase"
                    lts={1}
                    fw={600}
                    style={{ "&:hover": { color: "black" } }}
                  >
                    Continue Shopping
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
