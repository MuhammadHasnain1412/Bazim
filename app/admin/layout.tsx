"use client";

import { Box, Container, Group, Stack, Title, NavLink, Button } from "@mantine/core";
import {
  IconDashboard,
  IconBox,
  IconShoppingCart,
  IconChartBar,
  IconLogout,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminProtected } from "@/components/AdminProtected";
import { safeLocalStorage } from "@/lib/localStorage";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { icon: IconDashboard, label: "Dashboard", href: "/admin" },
    { icon: IconBox, label: "Products", href: "/admin/products" },
    { icon: IconShoppingCart, label: "Orders", href: "/admin/orders" },
    { icon: IconChartBar, label: "Analytics", href: "/admin/analytics" },
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
      <Box>
        <Box bg="dark" py="md">
          <Container size="xl">
            <Group justify="space-between">
              <Title order={2} c="white">
                Admin Dashboard
              </Title>
              <Button
                variant="outline"
                color="white"
                leftSection={<IconLogout size={16} />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Group>
          </Container>
        </Box>

        <Container size="xl" py="xl">
          <Group align="flex-start" gap="xl">
            <Stack gap="xs" style={{ minWidth: 200 }}>
              {links.map((link) => (
                <NavLink
                  key={link.href}
                  component={Link}
                  href={link.href}
                  label={link.label}
                  leftSection={<link.icon size={20} />}
                  active={pathname === link.href}
                />
              ))}
            </Stack>

            <Box style={{ flex: 1 }}>{children}</Box>
          </Group>
        </Container>
      </Box>
    </AdminProtected>
  );
}
