"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "@mantine/core";
import { safeLocalStorage } from "@/lib/localStorage";

interface AdminProtectedProps {
  children: React.ReactNode;
}

export function AdminProtected({ children }: AdminProtectedProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = safeLocalStorage.getItem("adminToken");

        if (!token) {
          router.push("/admin/login");
          return;
        }

        // Verify token with server
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user.role === "ADMIN") {
            setIsAuthenticated(true);
          } else {
            router.push("/admin/login");
          }
        } else {
          // Token invalid, redirect to login
          safeLocalStorage.removeItem("adminToken");
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <LoadingOverlay visible={loading} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <LoadingOverlay visible={true} />
      </div>
    );
  }

  return <>{children}</>;
}
