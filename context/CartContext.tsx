"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { safeLocalStorage } from "@/lib/localStorage";
import { notifications } from "@mantine/notifications";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isLoaded: boolean;
  lowStockItems: Set<string>;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lowStockItems, setLowStockItems] = useState<Set<string>>(new Set());

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = safeLocalStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      safeLocalStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = async (item: Omit<CartItem, "id">) => {
    try {
      // Get auth token if available
      const token = localStorage.getItem("adminToken");

      // Call API to check stock and add to cart
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          productId: item.productId,
          quantity: item.quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show stock validation error to user
        notifications.show({
          title: "Cannot Add to Cart",
          message: data.details || data.error,
          color: "red",
          radius: "xs",
        });
        return;
      }

      // Update local cart state
      setItems((prev) => {
        const existingItem = prev.find((i) => i.productId === item.productId);

        if (existingItem) {
          return prev.map((i) =>
            i.id === existingItem.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        }

        return [...prev, { ...item, id: `${item.productId}-${Date.now()}` }];
      });

      // Show success notification
      notifications.show({
        title: "Added to Cart",
        message: `${item.name} added to your cart`,
        color: "green",
        radius: "xs",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to add item to cart",
        color: "red",
        radius: "xs",
      });
    }
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    // Find the item to get product info
    const item = items.find((i) => i.id === id);
    if (!item) return;

    try {
      // Check stock availability when increasing quantity
      if (quantity > item.quantity) {
        // Get auth token if available
        const token = localStorage.getItem("adminToken");

        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            productId: item.productId,
            quantity: quantity - item.quantity, // Additional quantity requested
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Show stock validation error to user
          notifications.show({
            title: "Cannot Update Quantity",
            message: data.details || data.error,
            color: "red",
            radius: "xs",
          });
          return;
        }

        // Show low stock warning if present and add to low stock tracking
        if (data.warning) {
          notifications.show({
            title: "Low Stock Warning",
            message: data.warning.message,
            color: "orange",
            radius: "xs",
          });
          setLowStockItems((prev) => new Set(prev).add(item.productId));

          // Don't update quantity if there's a low stock warning
          // Keep the quantity at current level to prevent overselling
          return;
        }
      }

      // Update local cart state only if no low stock warning
      setItems((prev) =>
        prev.map((cartItem) =>
          cartItem.id === id ? { ...cartItem, quantity } : cartItem
        )
      );
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update quantity",
        color: "red",
        radius: "xs",
      });
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        isLoaded,
        lowStockItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
