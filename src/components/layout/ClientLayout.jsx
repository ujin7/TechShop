'use client';

/**
 * ClientLayout
 * hooks(useCart, useAuth)瑜??ъ슜?섏뿬 Navbar??props瑜?二쇱엯?섍퀬,
 * ?꾩뿭 ?ㅻ쾭?덉씠 而댄룷?뚰듃(CartDrawer, CompareBar, Toast, AuthModal)瑜??뚮뜑留곹븳??
 * layout.js(Server Component)??<body> ?덉뿉???몄텧?쒕떎.
 */
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

// 珥덇린 ?뚮뜑??遺덊븘?뷀븳 臾닿굅??而댄룷?뚰듃??dynamic import濡?遺꾨━
const CartDrawer  = dynamic(() => import('@/components/cart/CartDrawer'),   { ssr: false });
const CompareBar  = dynamic(() => import('@/components/compare/CompareBar'), { ssr: false });
const ToastList   = dynamic(() => import('@/components/ui/Toast'),           { ssr: false });
const AuthModal   = dynamic(() => import('@/components/auth/AuthModal'),     { ssr: false });

export default function ClientLayout({ children, categories }) {
  const router = useRouter();
  const { items, totalItems, isDrawerOpen, openDrawer, closeDrawer, removeFromCart, updateQuantity } = useCart();
  const { user, login, signup, loginWithGoogle, logout, isLoading: authLoading, authError } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // CartDrawer calls onUpdateQty(id, delta) with +1/-1 delta,
  // but useCart.updateQuantity expects absolute quantity.
  const handleUpdateQty = useCallback((productId, delta) => {
    const item = items.find((i) => i.productId === productId);
    if (item) updateQuantity(productId, item.quantity + delta);
  }, [items, updateQuantity]);

  // CartDrawer uses item.id but CartContext stores item.productId ??normalize here.
  const cartItems = items.map((i) => ({ ...i, id: i.productId }));

  const handleLogin = useCallback(async ({ email, password }) => {
    const result = await login(email, password);
    if (result.success) setIsAuthOpen(false);
  }, [login]);

  const handleSignup = useCallback(async ({ name, email, password }) => {
    const result = await signup({ name, email, password });
    if (result.success) setIsAuthOpen(false);
  }, [signup]);

  return (
    <>
      <Navbar
        categories={categories}
        cartItemCount={totalItems}
        onOpenCart={openDrawer}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onLogout={logout}
      />
      <main style={{ paddingTop: 'var(--navbar-height)' }}>
        {children}
      </main>
      <Footer />
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQty={handleUpdateQty}
        onCheckout={() => {
          closeDrawer();
          router.push('/checkout');
        }}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onGoogleLogin={loginWithGoogle}
        isLoading={authLoading}
        error={authError}
      />
      <CompareBar />
      <ToastList />
    </>
  );
}

