// src/context/CartContext.jsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  // initialize from localStorage
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      setCart(JSON.parse(localStorage.getItem('cart')) || []);
    } catch {
      setCart([]);
    }
  }, []);

  // persist to localStorage on change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isClient]);

  const openCart  = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = ({ product, variant, quantity }) => {
    setCart(prev => {
      const idx = prev.findIndex(
        item =>
          item.product._id === product._id &&
          item.variant.weight === variant.weight
      );
      if (idx > -1) {
        return prev.map((item, i) =>
          i === idx
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, variant, quantity }];
      }
    });
    openCart();
  };

  const updateQuantity = (productId, weight, qty) => {
    setCart(prev =>
      prev.map(item =>
        item.product._id === productId && item.variant.weight === weight
          ? { ...item, quantity: Math.max(1, qty) }
          : item
      )
    );
  };

  const removeFromCart = (productId, weight) => {
    setCart(prev =>
      prev.filter(
        item =>
          !(
            item.product._id === productId &&
            item.variant.weight === weight
          )
      )
    );
  };

  // ← derive the total number of units in the cart
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        totalQuantity  // ← expose it here
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
