"use client";

import {
  Container,
  Group,
  Text,
  Box,
  Title,
  ActionIcon,
  Indicator,
} from "@mantine/core";
import { IconShoppingCart, IconBrandWhatsapp } from "@tabler/icons-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";
import { COMPANY_CONTACT } from "@/lib/constants";

export function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <Box
      component="header"
      py={0}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 110,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      {/* SVG Filter to remove white background from logo */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="remove-white" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -1 -1 -1 3 0"
          />
        </filter>
      </svg>

      <Container size="xl">
        <Group justify="space-between" align="center" h={100}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <Group gap="sm">
              <img
                src="/HEADER.png?v=11"
                alt="Bazim"
                style={{
                  height: "70px",
                  width: "auto",
                  filter: "url(#remove-white) contrast(1.1)",
                  display: "block",
                }}
              />
            </Group>
          </Link>

          {/* Navigation */}
          <Group gap={40} visibleFrom="sm">
            <Link href="/" style={{ textDecoration: "none" }}>
              <Text
                size="sm"
                fw={pathname === "/" ? 700 : 500}
                c={pathname === "/" ? "bazim-navy" : "gray.6"}
                tt="uppercase"
                lts={1}
                style={{ transition: "all 0.2s" }}
              >
                Home
              </Text>
            </Link>
            <Link href="/products" style={{ textDecoration: "none" }}>
              <Text
                size="sm"
                fw={pathname.startsWith("/products") ? 700 : 500}
                c={pathname.startsWith("/products") ? "bazim-navy" : "gray.6"}
                tt="uppercase"
                lts={1}
                style={{ transition: "all 0.2s" }}
              >
                Shop
              </Text>
            </Link>
          </Group>

          <Group gap="xs">
            <ActionIcon
              component="a"
              href={`https://wa.me/${COMPANY_CONTACT.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="transparent"
              c="bazim-navy"
              size="lg"
            >
              <IconBrandWhatsapp size={20} stroke={1.5} />
            </ActionIcon>
            <Indicator
              label={itemCount}
              size={16}
              color="bazim-navy"
              disabled={itemCount === 0}
              offset={4}
              styles={{
                indicator: {
                  fontSize: "10px",
                  fontWeight: 700,
                },
              }}
            >
              <Link href="/cart" style={{ textDecoration: "none" }}>
                <ActionIcon variant="transparent" c="bazim-navy" size="lg">
                  <IconShoppingCart size={20} stroke={1.5} />
                </ActionIcon>
              </Link>
            </Indicator>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
