// src/context/CartContext.jsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const CART_STORAGE_KEY = 'thanmai_cart';

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    setIsClient(true);
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        } else {
          console.warn('Invalid cart data in localStorage');
          setCart([]);
        }
      }
    } catch (err) {
      console.error('Error loading cart from localStorage:', err);
      setError('Failed to load cart data');
      setCart([]);
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (isClient && !error) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (err) {
        console.error('Error saving cart to localStorage:', err);
        setError('Failed to save cart data');
      }
    }
  }, [cart, isClient, error]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback(({ product, variant, quantity }) => {
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
  }, [openCart]);

  const updateQuantity = useCallback((productId, weight, qty) => {
    setCart(prev =>
      prev.map(item =>
        item.product._id === productId && item.variant.weight === weight
          ? { ...item, quantity: Math.max(1, qty) }
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId, weight) => {
    setCart(prev =>
      prev.filter(
        item =>
          !(
            item.product._id === productId &&
            item.variant.weight === weight
          )
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (err) {
      console.error('Error clearing cart from localStorage:', err);
      setError('Failed to clear cart data');
    }
  }, []);

  // Calculate totals
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        error,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalQuantity,
        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
