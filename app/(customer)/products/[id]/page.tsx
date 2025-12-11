import { ProductDetail } from "@/components/customer/ProductDetail";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = products.find(p => p.id === id);
  
  if (!product) {
    notFound();
  }
  
  return <ProductDetail product={product} />;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}
