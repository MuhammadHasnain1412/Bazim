"use client";

import {
  Container,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Anchor,
  Box,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { safeLocalStorage } from "@/lib/localStorage";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          title: "Access Granted",
          message: "Welcome back.",
          color: "dark",
        });
        router.push("/admin");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }
    } catch (error) {
      notifications.show({
        title: "Access Denied",
        message:
          error instanceof Error
            ? error.message
            : "Please check your credentials.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Center h="100vh" bg="gray.0">
      <Container size="xs" w="100%">
        <Stack align="center" gap="xl" mb={40}>
          <Title order={1} size={24} fw={800} lts={2} tt="uppercase">
            Admin Portal
          </Title>
          <Text c="dimmed" size="sm" ta="center" maw={300}>
            Enter your credentials to access the management dashboard.
          </Text>
        </Stack>

        <Box>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                placeholder="Email Address"
                size="md"
                variant="filled"
                radius="sm"
                {...form.getInputProps("email")}
              />

              <PasswordInput
                placeholder="Password"
                size="md"
                variant="filled"
                radius="sm"
                {...form.getInputProps("password")}
              />

              <Button
                type="submit"
                fullWidth
                loading={loading}
                color="dark"
                size="md"
                radius="sm"
                tt="uppercase"
                fw={600}
                lts={1}
              >
                Sign In
              </Button>
            </Stack>
          </form>
        </Box>

        <Center mt="xl">
          <Anchor
            component={Link}
            href="/"
            size="sm"
            c="dimmed"
            style={{ textDecoration: "none" }}
          >
            ← Return to Store
          </Anchor>
        </Center>
      </Container>
    </Center>
  );
}
