// app/(customer)/products/[id]/page.tsx
import { ProductDetail } from "@/components/customer/ProductDetail";
import { notFound } from "next/navigation";

const products = [
  {
    id: "1",
    name: "Hooded Cotton Sweatshirt",
    price: 35.0,
    originalPrice: 45.0,
    image: "https://placehold.co/600x600/000000/ffffff?text=Sweatshirt",
    category: "Casual",
    inStock: true,
    colors: ["#000000", "#8B4513", "#191970"],
    badge: "New",
    discount: 15,
    description: "Premium quality cotton sweatshirt with comfortable hood and kangaroo pocket. Perfect for casual wear and outdoor activities.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.5,
    reviews: 150,
    features: [
      "100% Cotton",
      "Machine washable",
      "Comfortable fit",
      "Durable stitching"
    ]
  },
  {
    id: "2",
    name: "Classic White T-Shirt",
    price: 25.0,
    image: "https://placehold.co/600x600/ffffff/000000?text=T-Shirt",
    category: "Casual",
    inStock: true,
    colors: ["#FFFFFF", "#F5F5DC", "#E6E6FA"],
    description: "Classic white t-shirt made from premium cotton. A wardrobe essential for every man.",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.0,
    reviews: 89,
    features: [
      "100% Cotton",
      "Breathable fabric",
      "Regular fit",
      "Easy to care"
    ]
  },
  {
    id: "3",
    name: "Denim Jacket",
    price: 75.0,
    originalPrice: 95.0,
    image: "https://placehold.co/600x600/4169E1/ffffff?text=Denim",
    category: "Outerwear",
    inStock: true,
    colors: ["#4169E1", "#000080", "#483D8B"],
    discount: 20,
    description: "Classic denim jacket with modern fit. Perfect for layering in any season.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.7,
    reviews: 203,
    features: [
      "Denim fabric",
      "Multiple pockets",
      "Button closure",
      "Adjustable waist"
    ]
  }
];

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
