// components/customer/ProductCard.tsx
"use client";

import { Badge, Card, Group, Image, Stack, Text, Button } from "@mantine/core";
import { IconHeart, IconShoppingCart, IconEye, IconArrowsMaximize } from "@tabler/icons-react";
import { useState } from "react";
import Link from "next/link";

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

  return (
    <Card
      shadow="sm"
      padding="0"
      radius="md"
      withBorder
      style={{ position: "relative", overflow: "hidden" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {(badge || discount) && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 2,
          }}
        >
          {badge && (
            <Badge
              color="red"
              variant="filled"
              size="sm"
              style={{ marginBottom: "4px" }}
            >
              {badge}
            </Badge>
          )}
          {discount && (
            <Badge color="orange" variant="filled" size="sm">
              -{discount}%
            </Badge>
          )}
        </div>
      )}

      {/* Action Icons on Hover */}
      {isHovered && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Link href={`/products/${id}`} style={{ textDecoration: "none" }}>
            <Button
              size="sm"
              variant="white"
              p={8}
              style={{ background: "white", border: "1px solid #e0e0e0" }}
            >
              <IconEye size={16} />
            </Button>
          </Link>
          <Button
            size="sm"
            variant="white"
            p={8}
            style={{ background: "white", border: "1px solid #e0e0e0" }}
          >
            <IconHeart size={16} />
          </Button>
          <Button
            size="sm"
            variant="white"
            p={8}
            style={{ background: "white", border: "1px solid #e0e0e0" }}
          >
            <IconArrowsMaximize size={16} />
          </Button>
        </div>
      )}

      {/* Product Image - Clickable */}
      <Link href={`/products/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <Card.Section>
          <Image
            src={image}
            height={280}
            alt={name}
            fallbackSrc="https://placehold.co/300x300/e9ecef/666?text=Product"
            style={{ 
              transition: "transform 0.3s ease",
              cursor: "pointer"
            }}
          />
        </Card.Section>
      </Link>

      {/* Product Info - Clickable */}
      <Link href={`/products/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <Stack gap="xs" p="md">
          {/* Product Name */}
          <Text fw={500} size="sm" c="dark" lineClamp={2}>
            {name}
          </Text>

          {/* Price */}
          <Group gap="xs" align="baseline">
            <Text fw={600} size="lg" c="dark">
              ${price.toFixed(2)}
            </Text>
            {originalPrice && (
              <Text td="line-through" size="sm" c="gray.5">
                ${originalPrice.toFixed(2)}
              </Text>
            )}
          </Group>

          {/* Color Options */}
          {colors.length > 0 && (
            <Group gap="xs">
              {colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: color.toLowerCase(),
                    border: "1px solid #ddd",
                  }}
                />
              ))}
              {colors.length > 4 && (
                <Text size="xs" c="gray.5">
                  +{colors.length - 4}
                </Text>
              )}
            </Group>
          )}
        </Stack>
      </Link>

      {/* Add to Cart Button on Hover */}
      {isHovered && (
        <div style={{ padding: "0 16px 16px 16px" }}>
          <Button
            leftSection={<IconShoppingCart size={16} />}
            disabled={!inStock}
            variant="filled"
            bg="dark"
            c="white"
            w="100%"
          >
            Add to Cart
          </Button>
        </div>
      )}
    </Card>
  );
}
