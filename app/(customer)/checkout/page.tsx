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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { safeLocalStorage } from "@/lib/localStorage";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
        clearCart();
        notifications.show({
          title: "Order placed successfully!",
          message: "Thank you for your purchase. We will contact you soon.",
          color: "green",
        });
        router.push("/");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Order failed");
      }
    } catch (error: any) {
      notifications.show({
        title: "Order failed",
        message: error.message || "Please try again",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        Checkout
      </Title>

      <Group align="flex-start" gap="xl">
        <Card padding="lg" withBorder style={{ flex: 1 }}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <Title order={3}>Shipping Information</Title>

              <TextInput
                label="Full Name"
                placeholder="John Doe"
                required
                {...form.getInputProps("name")}
              />

              <TextInput
                label="Email"
                placeholder="john@example.com"
                required
                {...form.getInputProps("email")}
              />

              <TextInput
                label="Phone"
                placeholder="+1 234 567 8900"
                required
                {...form.getInputProps("phone")}
              />

              <Textarea
                label="Address"
                placeholder="123 Main St"
                required
                minRows={3}
                {...form.getInputProps("address")}
              />

              <Group grow>
                <TextInput
                  label="City"
                  placeholder="New York"
                  required
                  {...form.getInputProps("city")}
                />

                <TextInput
                  label="Postal Code"
                  placeholder="10001"
                  required
                  {...form.getInputProps("postalCode")}
                />
              </Group>

              <Button type="submit" size="lg" loading={loading} mt="md">
                Place Order
              </Button>
            </Stack>
          </form>
        </Card>

        <Card padding="lg" withBorder style={{ minWidth: 300 }}>
          <Stack gap="md">
            <Title order={3}>Order Summary</Title>
            <Divider />

            {items.map((item) => (
              <Group key={item.id} justify="space-between">
                <Stack gap={0}>
                  <Text size="sm">{item.name}</Text>
                  <Text size="xs" c="gray.6">
                    Qty: {item.quantity}
                  </Text>
                </Stack>
                <Text fw={600}>
                  Rs {Number(item.price * item.quantity).toFixed(2)}
                </Text>
              </Group>
            ))}

            <Divider />

            <Group justify="space-between">
              <Text size="lg" fw={600}>
                Total
              </Text>
              <Text size="xl" fw={700}>
                Rs {Number(total).toFixed(2)}
              </Text>
            </Group>
          </Stack>
        </Card>
      </Group>
    </Container>
  );
}
