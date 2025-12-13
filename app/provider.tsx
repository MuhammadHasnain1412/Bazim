"use client";

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ReactNode, useEffect, useState } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function Providers({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
