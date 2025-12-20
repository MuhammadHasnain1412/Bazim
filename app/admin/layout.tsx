"use client";

import {
  Box,
  Container,
  Group,
  Text,
  Button,
  Anchor,
  Paper,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminProtected } from "@/components/AdminProtected";
import { safeLocalStorage } from "@/lib/localStorage";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

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
          h={80}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
          radius={0}
        >
          <Container size="xl" h="100%">
            <Group justify="space-between" h="100%">
              <Text
                component={Link}
                href="/admin"
                size="xl"
                fw={900}
                tt="uppercase"
                lts={2}
                c="dark"
                style={{ textDecoration: "none" }}
              >
                Bazim Admin
              </Text>

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

              <Button
                variant="subtle"
                color="dark"
                size="xs"
                tt="uppercase"
                lts={1}
                leftSection={<IconLogout size={16} />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Group>
          </Container>
        </Paper>

        <Box flex={1} bg="gray.0">
          <Container size="xl" py={40}>
            {children}
          </Container>
        </Box>
      </Box>
    </AdminProtected>
  );
}
