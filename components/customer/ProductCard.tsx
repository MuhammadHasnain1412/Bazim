"use client";

import {
  Badge,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Button,
  Box,
  ActionIcon,
  Transition,
} from "@mantine/core";
import { IconHeart, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { notifications } from "@mantine/notifications";

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  colors?: string[];
  badge?: string;
  discount?: number;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  inStock,
  colors = [],
  badge,
  discount,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: id,
      name,
      price,
      image,
      category,
      inStock,
      colors,
    });
    notifications.show({
      title: isWishlisted ? "Removed" : "Added",
      message: `${name} ${isWishlisted ? "removed from" : "added to"} wishlist`,
      color: isWishlisted ? "gray" : "black",
      radius: "xs",
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: id,
      name,
      price,
      quantity: 1,
      image,
      color: colors[0],
    });
    notifications.show({
      title: "Basket Updated",
      message: `${name} added to your basket`,
      color: "black",
      radius: "xs",
    });
  };

  return (
    <Card
      padding="0"
      radius="0"
      bg="transparent"
      style={{
        transition: "all 0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Box
        style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4" }}
      >
        <Link
          href={`/products/${id}`}
          style={{ display: "block", height: "100%" }}
        >
          <Image
            src={image}
            alt={name}
            h="100%"
            w="100%"
            fit="cover"
            fallbackSrc="https://placehold.co/600x800/f8f9fa/adb5bd?text=Bazim+Collection"
            style={{
              transition: "transform 0.8s cubic-bezier(0.2, 0, 0.2, 1)",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        </Link>

        {/* Badges */}
        <Group
          gap={6}
          style={{ position: "absolute", top: 12, left: 12, zIndex: 5 }}
        >
          {badge && (
            <Badge
              variant="filled"
              color="black"
              radius="0"
              size="xs"
              tt="uppercase"
              lts={1}
              fw={700}
            >
              {badge}
            </Badge>
          )}
          {discount && (
            <Badge
              variant="filled"
              color="red.9"
              radius="0"
              size="xs"
              tt="uppercase"
              lts={1}
              fw={700}
            >
              -{discount}%
            </Badge>
          )}
          {inStock === false && (
            <Badge
              variant="filled"
              color="gray.6"
              radius="0"
              size="xs"
              tt="uppercase"
              lts={1}
              fw={700}
            >
              Sold Out
            </Badge>
          )}
        </Group>

        {/* Wishlist Button - Floating */}
        <ActionIcon
          onClick={handleToggleWishlist}
          variant="transparent"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 10,
            transition: "all 0.3s ease",
            transform: isHovered ? "translateY(0)" : "translateY(-5px)",
            opacity: isHovered ? 1 : 0,
          }}
        >
          <IconHeart
            size={22}
            stroke={1.5}
            color={isWishlisted ? "var(--mantine-color-red-9)" : "black"}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </ActionIcon>

        {/* Quick Add Button - Bottom Overlay */}
        <Transition
          mounted={isHovered && inStock !== false}
          transition="slide-up"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <Box
              style={{
                ...styles,
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 10,
                padding: "16px",
                background:
                  "linear-gradient(to top, rgba(255,255,255,0.9), transparent)",
              }}
            >
              <Button
                fullWidth
                variant="filled"
                color="black"
                radius="0"
                size="md"
                tt="uppercase"
                lts={2}
                fw={600}
                onClick={handleAddToCart}
                leftSection={<IconPlus size={16} />}
                style={{
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                }}
              >
                Quick Add
              </Button>
            </Box>
          )}
        </Transition>
      </Box>

      {/* Content */}
      <Stack gap={4} mt="md" flex={1}>
        <Group justify="space-between" align="start" wrap="nowrap">
          <Link
            href={`/products/${id}`}
            style={{ textDecoration: "none", color: "inherit", flex: 1 }}
          >
            <Text
              fw={600}
              size="sm"
              tt="uppercase"
              lts={1}
              lineClamp={1}
              style={{
                transition: "opacity 0.2s ease",
                opacity: isHovered ? 0.7 : 1,
              }}
            >
              {name}
            </Text>
            <Text size="xs" c="dimmed" tt="uppercase" lts={0.5} fw={500}>
              {category}
            </Text>
          </Link>

          <Stack gap={0} align="flex-end">
            <Text fw={700} size="sm">
              Rs {price.toLocaleString()}
            </Text>
            {originalPrice && (
              <Text td="line-through" size="xs" c="dimmed" fw={500}>
                Rs {originalPrice.toLocaleString()}
              </Text>
            )}
          </Stack>
        </Group>

        {/* Color Palette (Minimal Dots) */}
        {colors.length > 0 && (
          <Group gap={6} mt={4}>
            {colors.slice(0, 4).map((color, idx) => (
              <Box
                key={idx}
                w={8}
                h={8}
                style={{
                  borderRadius: "50%",
                  background: color,
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
            ))}
            {colors.length > 4 && (
              <Text size="xs" c="dimmed" fw={500}>
                +{colors.length - 4}
              </Text>
            )}
          </Group>
        )}
      </Stack>
    </Card>
  );
}
