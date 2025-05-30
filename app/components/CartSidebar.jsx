// src/components/CartSidebar.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import ImageWithFallback from './ImageWithFallback';
import { FiTrash2 } from 'react-icons/fi';
import '../../styles/components/CartSidebar.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartSidebar() {
  const router = useRouter();
  const {
    cart,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (!mounted) return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, mounted]);

  // Calculate subtotal
  const subtotal = cart
    .reduce((sum, { variant, quantity }) => {
      const price = variant.price;
      const discounted = variant.discountedPrice;
      if (!discounted || discounted === price) {
        return sum + price * quantity;
      }
      const discountFraction = (price - discounted) / price;
      if (discountFraction > 0.5) {
        return sum + price * quantity;
      }
      return sum + discounted * quantity;
    }, 0)
    .toFixed(2);

  const handleCheckout = () => {
    closeCart();
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`cs-overlay open`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={closeCart}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="cs-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={e => e.stopPropagation()}
          >
            <header className="cs-header">
              <h2>Shopping cart</h2>
              <motion.button className="cs-close" onClick={closeCart} whileTap={{ scale: 0.9 }} aria-label="Close cart sidebar">×</motion.button>
            </header>
            <div className="cs-items">
              {cart.length === 0 && (
                <p className="cs-empty">Your cart is empty.</p>
              )}
              {cart.map(({ product, variant, quantity }) => (
                <div
                  className="cs-item"
                  key={product._id + variant.weight}
                >
                  <ImageWithFallback
                    src={product.images?.[0] || '/assets/placeholder.png'}
                    alt={product.name}
                    width={60}
                    height={60}
                    className="cs-item-img"
                    nextImage={true}
                  />
                  <div className="cs-item-info">
                    <strong>{product.name}</strong>
                    <small>{variant.weight}</small>
                    <div className="cs-qty">
                      <motion.button
                        onClick={() =>
                          updateQuantity(
                            product._id,
                            variant.weight,
                            quantity - 1
                          )
                        }
                        disabled={quantity <= 1}
                        whileTap={{ scale: 0.9 }}
                      >
                        –
                      </motion.button>
                      <span>{quantity}</span>
                      <motion.button
                        onClick={() =>
                          updateQuantity(
                            product._id,
                            variant.weight,
                            quantity + 1
                          )
                        }
                        whileTap={{ scale: 0.9 }}
                      >
                        +
                      </motion.button>
                    </div>
                  </div>
                  <div className="cs-item-right">
                    <span>
                      {(() => {
                        const price = variant.price;
                        const discounted = variant.discountedPrice;
                        const qty = quantity;
                        if (!discounted || discounted === price) {
                          return <>Rs. {(price * qty).toFixed(2)}</>;
                        }
                        const discountFraction = (price - discounted) / price;
                        if (discountFraction > 0.5) {
                          return <>Rs. {(price * qty).toFixed(2)}</>;
                        }
                        return <>
                          <span style={{textDecoration: 'line-through', color: '#888', marginRight: 6}}>Rs. {(price * qty).toFixed(2)}</span>
                          <span>Rs. {(discounted * qty).toFixed(2)}</span>
                        </>;
                      })()}
                    </span>
                    <motion.button
                      className="cs-remove"
                      onClick={() =>
                        removeFromCart(product._id, variant.weight)
                      }
                      aria-label="Remove item"
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiTrash2 size={18} />
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
            <footer className="cs-footer">
              <div className="cs-subtotal">
                <strong>Subtotal</strong>
                <span>Rs. {subtotal}</span>
              </div>
              <motion.button
                className="cs-checkout"
                disabled={cart.length === 0}
                onClick={handleCheckout}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.04 }}
              >
                Checkout
              </motion.button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
