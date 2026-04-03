'use client';

import { useCallback, useMemo } from 'react';
import { useCartContext } from '@/context/CartContext';
import { calcShippingFee } from '@/utils/formatPrice';

/** 파생값 + 액션 전부 여기서 제공. Context는 건드리지 말 것. */
export function useCart() {
  const { items, dispatch, isDrawerOpen, setIsDrawerOpen } = useCartContext();

  /* 파생값 */
  const totalItems  = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const subtotal    = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);
  const shippingFee = useMemo(() => calcShippingFee(subtotal), [subtotal]);
  const total       = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee]);

  const isInCart = useCallback(
    (productId) => items.some((i) => i.productId === productId),
    [items]
  );

  /* 액션 */
  const addToCart = useCallback(
    (product, quantity = 1) => dispatch({ type: 'ADD', payload: { product, quantity } }),
    [dispatch]
  );
  const removeFromCart = useCallback(
    (productId) => dispatch({ type: 'REMOVE', payload: productId }),
    [dispatch]
  );
  const updateQuantity = useCallback(
    (productId, quantity) => dispatch({ type: 'UPDATE_QTY', payload: { productId, quantity } }),
    [dispatch]
  );
  const clearCart  = useCallback(() => dispatch({ type: 'CLEAR' }), [dispatch]);
  const openDrawer  = useCallback(() => setIsDrawerOpen(true),  [setIsDrawerOpen]);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [setIsDrawerOpen]);

  return {
    items,
    totalItems,
    subtotal,
    shippingFee,
    total,
    isDrawerOpen,
    isInCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openDrawer,
    closeDrawer,
  };
}
