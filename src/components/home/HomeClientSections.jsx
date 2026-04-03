'use client';

import Hero from '@/components/home/Hero';
import TrendingProducts from '@/components/home/TrendingProducts';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import FeaturedBanner from '@/components/home/FeaturedBanner';
import RecentlyViewed from '@/components/home/RecentlyViewed';
import { useCart } from '@/hooks/useCart';

export default function HomeClientSections({ products = [], categories = [], banners = [] }) {
  const { addToCart, openDrawer } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    openDrawer();
  };

  return (
    <>
      <Hero featuredProducts={products.slice(0, 3)} />
      <FeaturedBanner banners={banners} />
      <CategoryShowcase categories={categories} />
      <TrendingProducts products={products} onAddToCart={handleAddToCart} />
      <RecentlyViewed />
    </>
  );
}
