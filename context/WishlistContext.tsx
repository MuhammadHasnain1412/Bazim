"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { safeLocalStorage } from "@/lib/localStorage";

interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  colors?: string[];
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = safeLocalStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist from localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      safeLocalStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      if (prev.find((i) => i.productId === item.productId)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const toggleWishlist = (item: WishlistItem) => {
    if (isInWishlist(item.productId)) {
      removeFromWishlist(item.productId);
    } else {
      addToWishlist(item);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
