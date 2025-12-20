"use client";

import {
  Container,
  Title,
  Grid,
  GridCol,
  Stack,
  Text,
  Button,
} from "@mantine/core";
import { ProductCard } from "@/components/customer/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { IconHeart, IconShoppingBag } from "@tabler/icons-react";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <Container size="xl" py={100}>
        <Stack align="center" gap="xl">
          <IconHeart
            size={100}
            stroke={0.5}
            color="var(--mantine-color-gray-3)"
          />
          <Stack gap={4} align="center">
            <Title order={2} tt="uppercase" lts={2} fw={700}>
              Your wishlist is empty
            </Title>
            <Text c="gray.6" size="sm" tt="uppercase" lts={1}>
              Save your favorite items here to view them later.
            </Text>
          </Stack>
          <Button
            component={Link}
            href="/products"
            variant="filled"
            color="black"
            radius="0"
            size="md"
            tt="uppercase"
            lts={2}
            leftSection={<IconShoppingBag size={18} />}
          >
            Go Shopping
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl" mb={40}>
        <Title order={1} tt="uppercase" lts={2} fw={700}>
          My Wishlist
        </Title>
        <Text size="sm" c="dimmed" tt="uppercase" lts={1} fw={500}>
          {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"} Found
        </Text>
      </Stack>

      <Grid gutter="xl">
        {wishlist.map((item) => (
          <GridCol
            key={item.productId}
            span={{ base: 12, sm: 6, md: 4, lg: 3 }}
          >
            <ProductCard
              id={item.productId}
              name={item.name}
              price={item.price}
              image={item.image}
              category={item.category}
              inStock={item.inStock}
              colors={item.colors}
            />
          </GridCol>
        ))}
      </Grid>
    </Container>
  );
}
