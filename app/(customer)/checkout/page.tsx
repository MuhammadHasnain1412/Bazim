"use client";

import {
  Container,
  Title,
  Stack,
  Card,
  TextInput,
  Textarea,
  Button,
  Group,
  Text,
  Divider,
  Box,
  Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { safeLocalStorage } from "@/lib/localStorage";
import { IconCheck, IconX } from "@tabler/icons-react";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [orderId, setOrderId] = useState("");

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Name is too short" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      phone: (value) => (value.length < 10 ? "Invalid phone number" : null),
      address: (value) => (value.length < 10 ? "Address is too short" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const token = safeLocalStorage.getItem("token");
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
          })),
          shippingName: values.name,
          shippingPhone: values.phone,
          shippingAddress: `${values.address}, ${values.city}, ${values.postalCode}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderId(data.order.id);
        clearCart();
        open();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Order failed");
      }
    } catch (error: any) {
      notifications.show({
        title: "Order Failed",
        message: error.message || "Please try again or contact support",
        color: "#8b4513",
        icon: <IconX size={18} />,
        radius: "xs",
        autoClose: 6000,
        styles: {
          root: {
            backgroundColor: "#fff5f5",
            borderLeft: "4px solid #8b4513",
          },
          title: {
            fontFamily: "Georgia, serif",
            fontWeight: 600,
          },
          description: {
            fontFamily: "Georgia, serif",
          },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    close();
    router.push("/");
  };

  return (
    <Box bg="#fafaf8" style={{ minHeight: "100vh" }} py={60}>
      <Container size="xl">
        <Title
          order={1}
          mb="xl"
          c="#2c2c2c"
          style={{ fontFamily: "Georgia, serif" }}
          fw={400}
          lts={2}
          tt="uppercase"
        >
          Checkout
        </Title>

        <Group align="flex-start" gap="xl">
          <Card
            padding="xl"
            radius="0"
            style={{
              flex: 1,
              border: "1px solid #e8e6e1",
              backgroundColor: "white",
            }}
          >
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="lg">
                <Title
                  order={3}
                  c="#2c2c2c"
                  style={{ fontFamily: "Georgia, serif" }}
                  fw={600}
                  size={18}
                  tt="uppercase"
                  lts={1}
                >
                  Shipping Information
                </Title>

                <TextInput
                  label="Full Name"
                  placeholder="John Doe"
                  required
                  {...form.getInputProps("name")}
                  styles={{
                    label: {
                      fontFamily: "Georgia, serif",
                      color: "#2c2c2c",
                      fontWeight: 500,
                      marginBottom: 8,
                    },
                    input: {
                      fontFamily: "Georgia, serif",
                      borderRadius: 0,
                      borderColor: "#e8e6e1",
                    },
                  }}
                />

                <TextInput
                  label="Email"
                  placeholder="john@example.com"
                  required
                  {...form.getInputProps("email")}
                  styles={{
                    label: {
                      fontFamily: "Georgia, serif",
                      color: "#2c2c2c",
                      fontWeight: 500,
                      marginBottom: 8,
                    },
                    input: {
                      fontFamily: "Georgia, serif",
                      borderRadius: 0,
                      borderColor: "#e8e6e1",
                    },
                  }}
                />

                <TextInput
                  label="Phone"
                  placeholder="+92 300 1234567"
                  required
                  {...form.getInputProps("phone")}
                  styles={{
                    label: {
                      fontFamily: "Georgia, serif",
                      color: "#2c2c2c",
                      fontWeight: 500,
                      marginBottom: 8,
                    },
                    input: {
                      fontFamily: "Georgia, serif",
                      borderRadius: 0,
                      borderColor: "#e8e6e1",
                    },
                  }}
                />

                <Textarea
                  label="Address"
                  placeholder="123 Main Street"
                  required
                  minRows={3}
                  {...form.getInputProps("address")}
                  styles={{
                    label: {
                      fontFamily: "Georgia, serif",
                      color: "#2c2c2c",
                      fontWeight: 500,
                      marginBottom: 8,
                    },
                    input: {
                      fontFamily: "Georgia, serif",
                      borderRadius: 0,
                      borderColor: "#e8e6e1",
                    },
                  }}
                />

                <Group grow>
                  <TextInput
                    label="City"
                    placeholder="Karachi"
                    required
                    {...form.getInputProps("city")}
                    styles={{
                      label: {
                        fontFamily: "Georgia, serif",
                        color: "#2c2c2c",
                        fontWeight: 500,
                        marginBottom: 8,
                      },
                      input: {
                        fontFamily: "Georgia, serif",
                        borderRadius: 0,
                        borderColor: "#e8e6e1",
                      },
                    }}
                  />

                  <TextInput
                    label="Postal Code"
                    placeholder="75500"
                    required
                    {...form.getInputProps("postalCode")}
                    styles={{
                      label: {
                        fontFamily: "Georgia, serif",
                        color: "#2c2c2c",
                        fontWeight: 500,
                        marginBottom: 8,
                      },
                      input: {
                        fontFamily: "Georgia, serif",
                        borderRadius: 0,
                        borderColor: "#e8e6e1",
                      },
                    }}
                  />
                </Group>

                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  mt="md"
                  fullWidth
                  radius="0"
                  color="#2c2c2c"
                  styles={{
                    root: {
                      fontFamily: "Georgia, serif",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      fontSize: "14px",
                      fontWeight: 600,
                      backgroundColor: "#2c2c2c",
                      "&:hover": {
                        backgroundColor: "#1a1a1a",
                      },
                    },
                  }}
                >
                  Place Order
                </Button>
              </Stack>
            </form>
          </Card>

          <Card
            padding="xl"
            radius="0"
            style={{
              minWidth: 350,
              border: "1px solid #e8e6e1",
              backgroundColor: "white",
            }}
          >
            <Stack gap="lg">
              <Title
                order={3}
                c="#2c2c2c"
                style={{ fontFamily: "Georgia, serif" }}
                fw={600}
                size={18}
                tt="uppercase"
                lts={1}
              >
                Order Summary
              </Title>
              <Divider color="#e8e6e1" />

              {items.map((item) => (
                <Group key={item.id} justify="space-between" align="flex-start">
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Text
                      size="sm"
                      fw={500}
                      c="#2c2c2c"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      size="xs"
                      c="dimmed"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Qty: {item.quantity}
                      {item.color && ` • Color: ${item.color}`}
                    </Text>
                  </Stack>
                  <Text
                    fw={600}
                    c="#2c2c2c"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Rs {Number(item.price * item.quantity).toLocaleString()}
                  </Text>
                </Group>
              ))}

              <Divider color="#e8e6e1" />

              <Group justify="space-between">
                <Text
                  size="lg"
                  fw={600}
                  c="#2c2c2c"
                  tt="uppercase"
                  lts={1}
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Total
                </Text>
                <Text
                  size="xl"
                  fw={700}
                  c="#2c2c2c"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Rs {Number(total).toLocaleString()}
                </Text>
              </Group>
            </Stack>
          </Card>
        </Group>
      </Container>

      <Modal
        opened={opened}
        onClose={handleContinueShopping}
        title={
          <Text size="xl" fw={700} style={{ fontFamily: "Georgia, serif" }}>
            ORDER CONFIRMED
          </Text>
        }
        centered
        size="lg"
        styles={{
          header: {
            borderBottom: "1px solid #f1f3f5",
          },
          body: {
            paddingTop: "20px",
          },
        }}
      >
        <Stack gap="md" align="center" ta="center">
          <Box c="green.6">
            <IconCheck size={64} stroke={1.5} />
          </Box>

          <Title order={3} style={{ fontFamily: "Georgia, serif" }}>
            Thank you for your order!
          </Title>

          <Text c="dimmed">Order ID: #{orderId}</Text>

          <Box
            bg="gray.0"
            p="md"
            style={{ borderRadius: "8px", width: "100%" }}
            ta="left"
          >
            <Stack gap="xs">
              <Text fw={600} size="sm">
                Delivery Instructions:
              </Text>
              <Text size="sm" c="dimmed">
                Your order has been placed successfully. You will receive a
                confirmation call shortly to verify your details. Shipping
                usually takes 3-5 business days.
              </Text>

              <Divider my="xs" />

              <Text fw={600} size="sm">
                For Queries:
              </Text>
              <Text size="sm" c="dimmed">
                Contact no: <strong>+92 300 1234567</strong>
                <br />
                Email: <strong>info@bazim.com</strong>
              </Text>
            </Stack>
          </Box>

          <Button
            color="dark"
            size="md"
            fullWidth
            onClick={handleContinueShopping}
            mt="md"
            styles={{
              root: {
                fontFamily: "Georgia, serif",
                textTransform: "uppercase",
                letterSpacing: "1px",
              },
            }}
          >
            Continue Shopping
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
}
