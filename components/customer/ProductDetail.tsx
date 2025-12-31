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
  TextInput,
  Textarea,
  Divider,
  Box,
} from "@mantine/core";
import {
  IconMinus,
  IconPlus,
  IconHeart,
  IconShoppingCart,
  IconStar,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { notifications } from "@mantine/notifications";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/constants";

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    fabricType: string;
    inStock: boolean;
    colors: string[];
    badge?: string;
    discount?: number;
    description: string;
    rating: number;
    reviewCount: number;
    reviewsList: {
      id: string;
      rating: number;
      comment: string;
      userName: string;
      createdAt: string;
    }[];
    features: string[];
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0] || ""
  );
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleToggleWishlist = () => {
    toggleWishlist({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      fabricType: product.fabricType,
      inStock: product.inStock,
      colors: product.colors,
    });
    notifications.show({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      message: `${product.name} has been ${
        isWishlisted ? "removed from" : "added to"
      } your wishlist`,
      color: isWishlisted ? "gray" : "red",
    });
  };

  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      notifications.show({
        title: "Select Color",
        message: "Please select a color before adding to cart",
        color: "yellow",
      });
      return;
    }

    await addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      color: selectedColor,
    });
  };

  // Review Form state
  const [submittingReview, setSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    userName: "",
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment) {
      notifications.show({
        title: "Missing Fields",
        message: "Please provide your name and a comment.",
        color: "red",
      });
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch(`/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        notifications.show({
          title: "Success",
          message: "Your review has been submitted.",
          color: "green",
        });
        setNewReview({ rating: 5, comment: "", userName: "" });
        window.location.reload();
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to submit review. Please try again.",
        color: "red",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (data.products) {
          // Get products excluding current one, limit to 2
          const related = data.products
            .filter((p: any) => p.id !== product.id)
            .slice(0, 2)
            .map((p: any) => {
              const images = JSON.parse(p.images || "[]");
              const colors = JSON.parse(p.colors || "[]");

              return {
                id: p.id,
                name: p.name,
                price: p.price,
                image: images[0] || DEFAULT_PRODUCT_IMAGE,
                fabricType: p.fabricType || "Premium Fabric",
                inStock: p.stock > 0,
                colors: colors,
                badge: p.featured ? "Featured" : undefined,
              };
            });

          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      }
    };

    if (product?.id) {
      fetchRelatedProducts();
    }
  }, [product?.id]);

  return (
    <Container size="xl" py="xl">
      <Group gap="xs" mb="lg">
        <Text size="sm" c="gray.6">
          Home
        </Text>
        <Text size="sm" c="gray.6">
          /
        </Text>
        <Text size="sm" c="gray.6">
          Shop
        </Text>
        <Text size="sm" c="gray.6">
          /
        </Text>
        <Text size="sm" c="gray.6">
          {product.fabricType}
        </Text>
      </Group>

      <Grid>
        <GridCol span={{ base: 12, md: 6 }}>
          <Image src={product?.image} alt={product?.name} radius="md" />
        </GridCol>

        <GridCol span={{ base: 12, md: 6 }}>
          <Stack gap="lg">
            {product.badge && (
              <Badge color="red" variant="filled" w="fit-content">
                {product.badge}
              </Badge>
            )}

            <Title order={1} size={32} fw={600}>
              {product.name}
            </Title>

            <Group gap="xs" align="baseline">
              <Text size="xl" fw={600}>
                Rs {Number(product.price).toFixed(2)}
              </Text>
              {product.originalPrice && (
                <Text td="line-through" size="lg" c="gray.5">
                  Rs {Number(product.originalPrice).toFixed(2)}
                </Text>
              )}
            </Group>

            <Group gap="xs">
              <Rating value={product?.rating || 0} fractions={2} readOnly />
              <Text size="sm" c="gray.6">
                ({product?.reviewCount || 0} Reviews)
              </Text>
            </Group>

            <Text c="gray.6">{product.description}</Text>

            {/* Color Selection */}
            <Stack gap="sm">
              <Text fw={500}>Colors</Text>
              <Group gap="xs">
                {product?.colors?.map((color) => (
                  <div
                    key={color}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: color.toLowerCase(),
                      border:
                        selectedColor === color
                          ? "2px solid #132d46"
                          : "1px solid #ddd",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </Group>
            </Stack>

            {/* Quantity and Add to Cart */}
            <Group gap="sm" align="center">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  overflow: "hidden",
                  width: "100px",
                }}
              >
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    border: "none",
                    borderRadius: "0",
                    height: "36px",
                  }}
                >
                  <IconMinus size={14} />
                </ActionIcon>
                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "0 8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    borderLeft: "1px solid #dee2e6",
                    borderRight: "1px solid #dee2e6",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                  }}
                >
                  {quantity}
                </div>
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  style={{
                    border: "none",
                    borderRadius: "0",
                    height: "36px",
                  }}
                >
                  <IconPlus size={14} />
                </ActionIcon>
              </div>
              <Button
                leftSection={<IconShoppingCart size={18} />}
                size="lg"
                style={{ flex: 1 }}
                color="bazim-navy"
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <ActionIcon
                size="lg"
                variant={isWishlisted ? "filled" : "outline"}
                color={isWishlisted ? "red" : "gray"}
                onClick={handleToggleWishlist}
              >
                <IconHeart
                  size={18}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </ActionIcon>
            </Group>

            {/* Stock Status */}
            <Group gap="xs">
              <Badge color="green" variant="light">
                In Stock
              </Badge>
              <Text size="sm" c="gray.6">
                Delivery and Return
              </Text>
            </Group>

            {/* Features */}
            <Stack gap="xs">
              {product?.features?.map((feature, index) => (
                <Text key={index} size="sm">
                  {feature}
                </Text>
              ))}
            </Stack>
          </Stack>
        </GridCol>
      </Grid>

      {/* Tabs Section */}
      <Tabs defaultValue="description" mt="xl">
        <Tabs.List>
          <Tabs.Tab value="description">Description</Tabs.Tab>
          <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
          <Tabs.Tab value="specification">Specification</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="description" pt="md">
          <Text>{product.description}</Text>
        </Tabs.Panel>

        <Tabs.Panel value="reviews" pt="xl">
          <Grid gutter={40}>
            <GridCol span={{ base: 12, md: 7 }}>
              <Stack gap="xl">
                <Title order={3} size="h4" tt="uppercase" lts={1}>
                  Customer Reviews ({product?.reviewCount || 0})
                </Title>

                {!product?.reviewsList || product.reviewsList.length === 0 ? (
                  <Text c="gray.6" fs="italic">
                    No reviews yet. Be the first to share your thoughts!
                  </Text>
                ) : (
                  <Stack gap="xl">
                    {product.reviewsList.map((review) => (
                      <Box key={review.id}>
                        <Group justify="space-between" mb="xs">
                          <Stack gap={2}>
                            <Text fw={700} size="sm" tt="uppercase">
                              {review.userName}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </Text>
                          </Stack>
                          <Rating value={review.rating} readOnly size="xs" />
                        </Group>
                        <Text size="sm" c="gray.7">
                          {review.comment}
                        </Text>
                        <Divider mt="xl" color="gray.1" />
                      </Box>
                    ))}
                  </Stack>
                )}
              </Stack>
            </GridCol>

            <GridCol span={{ base: 12, md: 5 }}>
              <Box p="xl" bg="gray.0" style={{ borderRadius: "8px" }}>
                <Stack gap="md">
                  <Title order={3} size="h4" tt="uppercase" lts={1}>
                    Write a Review
                  </Title>
                  <form onSubmit={handleSubmitReview}>
                    <Stack gap="md">
                      <div>
                        <Text size="sm" fw={500} mb={4}>
                          Rating
                        </Text>
                        <Rating
                          value={newReview.rating}
                          onChange={(val) =>
                            setNewReview({ ...newReview, rating: val })
                          }
                        />
                      </div>
                      <TextInput
                        label="Your Name"
                        placeholder="e.g. John Doe"
                        required
                        value={newReview.userName}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            userName: e.target.value,
                          })
                        }
                      />
                      <Textarea
                        label="Comment"
                        placeholder="What did you like or dislike about this product?"
                        required
                        minRows={4}
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            comment: e.target.value,
                          })
                        }
                      />
                      <Button
                        type="submit"
                        color="bazim-navy"
                        fullWidth
                        loading={submittingReview}
                        tt="uppercase"
                      >
                        Submit Review
                      </Button>
                    </Stack>
                  </form>
                </Stack>
              </Box>
            </GridCol>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="specification" pt="md">
          <Stack gap="sm">
            {product?.features?.map((feature, index) => (
              <Text key={index} size="sm">
                {feature}
              </Text>
            ))}
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Stack gap="lg" mt="xl">
          <Title order={2} tt="uppercase" lts={1} fw={700}>
            Related Products
          </Title>
          <Grid>
            {relatedProducts.map((product) => (
              <GridCol key={product.id} span={{ base: 12, sm: 6, md: 4 }}>
                <ProductCard {...product} />
              </GridCol>
            ))}
          </Grid>
        </Stack>
      )}
    </Container>
  );
}
