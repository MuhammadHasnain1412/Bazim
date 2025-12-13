"use client";

import { Container, Title, Text, Button } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function DebugNewProductPage() {
  const router = useRouter();

  return (
    <Container size="xl" py="xl">
      <Title order={1}>Debug New Product Page</Title>
      <Text>This is a minimal version to test localStorage errors</Text>
      
      <Button onClick={() => router.push("/admin/products/new")}>
        Go to Actual New Product Page
      </Button>
    </Container>
  );
}
