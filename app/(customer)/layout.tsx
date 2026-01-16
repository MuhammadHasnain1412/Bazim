import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { CartProvider } from "@/context/CartContext";
import { WhatsAppWidget } from "@/components/shared/WhatsAppWidget";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Navbar />
      <main>{children}</main>
      <WhatsAppWidget />
      <Footer />
    </CartProvider>
  );
}
