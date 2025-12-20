import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <WishlistProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </WishlistProvider>
    </CartProvider>
  );
}
