'use client';

import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import TrendingProducts from '@/components/home/TrendingProducts';
import RecentlyViewed from '@/components/home/RecentlyViewed';
import { useCart } from '@/hooks/useCart';

export default function HomeClientSections({ products = [], categories = [] }) {
  const { addToCart, openDrawer } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    openDrawer();
  };

  return (
    <>
      <Hero />
      <FeaturedProducts products={products.slice(0, 3)} />
      <CategoryShowcase categories={categories} />
      <WhyChooseUs />
      <TrendingProducts products={products} onAddToCart={handleAddToCart} />
      <RecentlyViewed />
    </>
  );
}
