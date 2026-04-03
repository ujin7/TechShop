'use client';

import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { lsGet, lsSet } from '@/utils/localStorage';

const LS_CART_KEY = 'techshop_cart';

export const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.payload;
    case 'ADD': {
      const { product, quantity = 1 } = action.payload;
      const existing = state.find((i) => i.productId === product.id);
      if (existing) {
        return state.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, i.maxStock) }
            : i
        );
      }
      return [
        ...state,
        {
          productId: product.id,
          name:      product.name,
          price:     product.price,
          thumbnail: product.thumbnail,
          quantity:  Math.min(quantity, product.stock),
          maxStock:  product.stock,
        },
      ];
    }
    case 'REMOVE':
      return state.filter((i) => i.productId !== action.payload);
    case 'UPDATE_QTY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) return state.filter((i) => i.productId !== productId);
      return state.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.min(quantity, i.maxStock) } : i
      );
    }
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

/** Context는 state + dispatch 만 보관. 파생값·액션은 useCart() hook에서 */
export function CartProvider({ children }) {
  const [items, dispatch]                   = useReducer(cartReducer, []);
  const [isDrawerOpen, setIsDrawerOpen]     = useState(false);
  const [initialized, setInitialized]       = useState(false);

  useEffect(() => {
    dispatch({ type: 'INIT', payload: lsGet(LS_CART_KEY, []) });
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) lsSet(LS_CART_KEY, items);
  }, [items, initialized]);

  return (
    <CartContext.Provider value={{ items, dispatch, isDrawerOpen, setIsDrawerOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used within CartProvider');
  return ctx;
};
