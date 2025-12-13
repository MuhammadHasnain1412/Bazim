"use client";

import {
  Container,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Card,
  Stack,
  Text,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { safeLocalStorage } from "@/lib/localStorage";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length < 6 ? "Password too short" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        safeLocalStorage.setItem("adminToken", data.token);
        notifications.show({
          title: "Login successful",
          message: "Welcome to admin dashboard",
          color: "green",
        });
        router.push("/admin");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }
    } catch (error) {
      notifications.show({
        title: "Login failed",
        message: error instanceof Error ? error.message : "Please try again",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" mb="md">
        Admin Login
      </Title>

      <Text c="dimmed" size="sm" ta="center" mb={20}>
        Access the admin dashboard to manage products, orders, and more
      </Text>

      <Card withBorder shadow="md" p="lg">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="admin@bazim.com"
              required
              {...form.getInputProps("email")}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              required
              {...form.getInputProps("password")}
            />

            <Button type="submit" fullWidth loading={loading}>
              Sign in
            </Button>
          </Stack>
        </form>
      </Card>

      <Text c="dimmed" size="sm" ta="center" mt="md">
        <Anchor component={Link} href="/">
          Back to store
        </Anchor>
      </Text>
    </Container>
  );
}
