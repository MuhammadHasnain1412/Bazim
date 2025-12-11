export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  images: string[];
  colors: string[];
  tags: string[];
  featured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  quantity: number;
  color: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  color?: string;
}
