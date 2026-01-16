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
  const {
    items,
    removeFromCart,
    updateQuantity,
    total,
    itemCount,
    isLoaded,
    lowStockItems,
  } = useCart();

  const hasLowStockItems = items.some((item) =>
    lowStockItems.has(item.productId)
  );

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
                  <Group justify="space-between" align="start" wrap="nowrap">
                    <Group
                      gap="lg"
                      align="flex-start"
                      style={{ flex: 1 }}
                      wrap="nowrap"
                    >
                      <Box
                        bg="gray.0"
                        style={{
                          width: "clamp(100px, 25vw, 140px)",
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

                      <Stack
                        gap="xs"
                        style={{
                          flex: 1,
                          height: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Stack gap={4}>
                          <Text
                            fw={700}
                            size="lg" // Responsive size actually handled by clamp or media queries usually, but "lg" is okay
                            tt="uppercase"
                            lts={1}
                            component={Link}
                            href={`/products/${item.productId}`}
                            c="dark"
                            style={{
                              textDecoration: "none",
                              fontSize: "clamp(16px, 4vw, 20px)",
                            }}
                          >
                            {item.name}
                          </Text>
                          <Text size="xs" c="dimmed" tt="uppercase" lts={0.5}>
                            Unstitched Collection
                          </Text>
                        </Stack>

                        {/* Mobile: Quantity and Price Stacked */}
                        <Stack gap="md" mt="auto">
                          <Text fw={700} size="md">
                            Rs {Number(item.price).toLocaleString()}
                          </Text>
                          <Group gap="sm" visibleFrom="xs">
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
                              disabled={lowStockItems.has(item.productId)}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <IconPlus size={14} />
                            </ActionIcon>
                          </Group>
                        </Stack>
                      </Stack>
                    </Group>

                    {/* Right Side Actions - Hidden on very small screens if we move functionality to left */}
                    <Stack
                      align="flex-end"
                      justify="space-between"
                      style={{ height: "clamp(133px, 20vw, 140px)" }}
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

                      {/* Mobile Quantity Selector (Duplicate for Mobile Layout if needed, or unify) */}
                      {/* Let's keep the existing structure but hide this group on mobile if we moved it inside */}
                      <Group
                        gap={5}
                        style={{
                          border: "1px solid var(--mantine-color-gray-2)",
                          padding: "4px",
                        }}
                        hiddenFrom="xs"
                      >
                        {/* Mobile only compact quantity controls */}
                        <ActionIcon
                          variant="transparent"
                          color="dark"
                          size="xs"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <IconMinus size={12} />
                        </ActionIcon>
                        <Text size="xs" fw={600} w={20} ta="center">
                          {item.quantity}
                        </Text>
                        <ActionIcon
                          variant="transparent"
                          color="dark"
                          size="xs"
                          disabled={lowStockItems.has(item.productId)}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <IconPlus size={12} />
                        </ActionIcon>
                      </Group>

                      {/* Desktop Quantity Selector */}
                      <Group
                        gap={5}
                        style={{
                          border: "1px solid var(--mantine-color-gray-2)",
                          padding: "4px",
                        }}
                        visibleFrom="xs"
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
                          disabled={lowStockItems.has(item.productId)}
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
                    lts={{ base: 1, sm: 2 }}
                    fw={700}
                    rightSection={<IconArrowRight size={18} />}
                    style={{ height: 60, paddingLeft: 10, paddingRight: 10 }}
                    styles={{ section: { marginLeft: 8 } }}
                    disabled={hasLowStockItems}
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
