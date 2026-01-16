"use client";

import {
  Box,
  Container,
  Group,
  Text,
  Button,
  Anchor,
  Paper,
  Burger,
  Drawer,
  Stack,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminProtected } from "@/components/AdminProtected";
import { safeLocalStorage } from "@/lib/localStorage";
import { useDisclosure } from "@mantine/hooks";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [opened, { toggle, close }] = useDisclosure();

  const links = [
    { label: "Dashboard", href: "/admin" },
    { label: "Products", href: "/admin/products" },
    { label: "Orders", href: "/admin/orders" },
    { label: "Analytics", href: "/admin/analytics" },
  ];

  const handleLogout = () => {
    safeLocalStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  // Don't protect the login page itself
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminProtected>
      <Box
        bg="white"
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Paper
          h={120}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 110,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
          radius={0}
        >
          {/* SVG Filter to remove white background from logo */}
          <svg width="0" height="0" style={{ position: "absolute" }}>
            <filter id="remove-white-admin" colorInterpolationFilters="sRGB">
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        -1 -1 -1 3 0"
              />
            </filter>
          </svg>

          <Container size="xl" h="100%">
            <Group justify="space-between" h="100%">
              <Link href="/admin" style={{ textDecoration: "none" }}>
                <Group gap="xs">
                  <img
                    src="/logo.png?v=11"
                    alt="Bazim"
                    style={{
                      height: "100px",
                      width: "auto",
                      filter: "url(#remove-white-admin) contrast(1.1)",
                    }}
                  />
                </Group>
              </Link>

              <Group gap={40} visibleFrom="sm">
                {links.map((link) => (
                  <Anchor
                    key={link.href}
                    component={Link}
                    href={link.href}
                    c={pathname === link.href ? "dark" : "dimmed"}
                    fw={500}
                    tt="uppercase"
                    size="xs"
                    lts={1}
                    underline="never"
                    style={{
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e: any) =>
                      (e.currentTarget.style.color = "black")
                    }
                    onMouseLeave={(e: any) =>
                      (e.currentTarget.style.color =
                        pathname === link.href
                          ? "black"
                          : "var(--mantine-color-dimmed)")
                    }
                  >
                    {link.label}
                  </Anchor>
                ))}
              </Group>

              <Group>
                <Button
                  variant="subtle"
                  color="dark"
                  size="xs"
                  tt="uppercase"
                  lts={1}
                  leftSection={<IconLogout size={16} />}
                  onClick={handleLogout}
                  visibleFrom="sm"
                >
                  Logout
                </Button>

                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                />
              </Group>
            </Group>
          </Container>
        </Paper>

        <Drawer
          opened={opened}
          onClose={close}
          size="100%"
          padding="md"
          title="Menu"
          hiddenFrom="sm"
          zIndex={1000}
        >
          <Stack gap="xl" mt="xl">
            {links.map((link) => (
              <Anchor
                key={link.href}
                component={Link}
                href={link.href}
                onClick={close}
                c={pathname === link.href ? "dark" : "dimmed"}
                fw={600}
                tt="uppercase"
                size="lg"
                lts={1}
                underline="never"
              >
                {link.label}
              </Anchor>
            ))}

            <Button
              variant="light"
              color="red"
              fullWidth
              mt="xl"
              leftSection={<IconLogout size={18} />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Stack>
        </Drawer>

        <Box flex={1} bg="gray.0">
          <Container size="xl" py={40}>
            {children}
          </Container>
        </Box>
      </Box>
    </AdminProtected>
  );
}
