"use client";

import { Container, Title, Grid, GridCol, Stack, Text } from "@mantine/core";
import { ProductCard } from "@/components/customer/ProductCard";
import { useEffect, useState } from "react";
import { IconHeart } from "@tabler/icons-react";
import { safeLocalStorage } from "@/lib/localStorage";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist", {
        headers: {
          Authorization: `Bearer ${safeLocalStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWishlist(data.items);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (wishlist.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" gap="xl">
          <IconHeart size={80} stroke={1} color="gray" />
          <Title order={2}>Your wishlist is empty</Title>
          <Text c="gray.6">Save your favorite items here</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        My Wishlist ({wishlist.length} items)
      </Title>

      <Grid>
        {wishlist.map((item: any) => (
          <GridCol key={item.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <ProductCard
              id={item.product.id}
              name={item.product.name}
              price={Number(item.product.price)}
              image={JSON.parse(item.product.images)[0]}
              category={item.product.category.name}
              inStock={item.product.stock > 0}
              colors={JSON.parse(item.product.colors)}
            />
          </GridCol>
        ))}
      </Grid>
    </Container>
  );
}
