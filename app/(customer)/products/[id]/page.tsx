"use client";

import { Container, Group, Stack, Title, Text, Button, Badge, Image, Grid, GridCol, Rating, NumberInput, ActionIcon, Tabs, Skeleton } from "@mantine/core";
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
  images: string;
  colors: string;
  sizes: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
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
        console.error('Failed to fetch product:', error);
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
    const images = JSON.parse(product.images || '[]');
    const colors = JSON.parse(product.colors || '[]');
    const sizes = JSON.parse(product.sizes || '[]');
    
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0] || '/images/testimg.jpeg',
      category: product.category.name,
      inStock: product.stock > 0,
      colors: colors,
      badge: product.featured ? 'Featured' : undefined,
      description: product.description,
      sizes: sizes,
      rating: 4.5,
      reviews: 150,
      features: [
        'Premium quality fabric',
        'Comfortable fit',
        'Durable stitching',
        'Easy to care'
      ]
    };
  };

  // Dynamic import to avoid circular dependency issues
  const ProductDetail = require("@/components/customer/ProductDetail").ProductDetail;
  
  return <ProductDetail product={formatProductDetail(product)} />;
}
