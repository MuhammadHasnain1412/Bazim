"use client";

import {
  Container,
  Group,
  Stack,
  Title,
  Text,
  Button,
  Badge,
  Image,
  Grid,
  GridCol,
  Rating,
  NumberInput,
  ActionIcon,
  Tabs,
  Skeleton,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  featured: boolean;
  images: any;
  reviews: {
    id: string;
    rating: number;
    comment: string;
    userName: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        const data = await response.json();

        if (data.product) {
          setProduct(data.product);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Grid>
          <GridCol span={{ base: 12, md: 6 }}>
            <Skeleton height={400} radius="md" />
          </GridCol>
          <GridCol span={{ base: 12, md: 6 }}>
            <Stack gap="lg">
              <Skeleton height={32} width="70%" />
              <Skeleton height={28} width="40%" />
              <Skeleton height={20} width="30%" />
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width="100%" />
              <Group gap="sm">
                <Skeleton height={36} width={100} />
                <Skeleton height={48} width="60%" />
                <Skeleton height={48} width={48} />
              </Group>
              <Skeleton height={20} width="30%" />
            </Stack>
          </GridCol>
        </Grid>
      </Container>
    );
  }

  if (!product) {
    return notFound();
  }

  const formatProductDetail = (product: Product) => {
    let imageUrl = "/images/testimg.jpeg";

    if (Array.isArray(product.images) && product.images.length > 0) {
      imageUrl = `/api/upload?id=${product.images[0].id}`;
    } else if (typeof product.images === "string") {
      try {
        const parsed = JSON.parse(product.images || "[]");
        if (parsed.length > 0) imageUrl = parsed[0];
      } catch (e) {
        console.error("Error parsing legacy images", e);
      }
    }

    const reviews = product.reviews || [];
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      fabricType: "Premium Fabric", // Replaced category with hardcoded or other field, since category is gone
      inStock: product.stock > 0,
      badge: product.featured ? "Featured" : undefined,
      description: product.description,
      rating: avgRating,
      reviewCount: reviews.length,
      reviewsList: reviews,
      features: [
        "Premium quality fabric",
        "Comfortable fit",
        "Durable stitching",
        "Easy to care",
      ],
    };
  };

  // Dynamic import to avoid circular dependency issues
  const ProductDetail =
    require("@/components/customer/ProductDetail").ProductDetail;

  return <ProductDetail product={formatProductDetail(product)} />;
}
