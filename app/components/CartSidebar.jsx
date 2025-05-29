// src/components/CartSidebar.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import ImageWithFallback from './ImageWithFallback';
import { FiTrash2 } from 'react-icons/fi';
import '../../styles/components/CartSidebar.css';

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

  useEffect(() => { setMounted(true); }, []);

  // Calculate subtotal
  const subtotal = cart
    .reduce(
      (sum, { variant, quantity }) =>
        sum + (variant.discountedPrice || variant.price) * quantity,
      0
    )
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
    <div className={`cs-overlay ${isOpen ? 'open' : ''}`}>
      <div className="cs-drawer">
        <header className="cs-header">
          <h2>Shopping cart</h2>
          <button className="cs-close" onClick={closeCart}>×</button>
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
                  <button
                    onClick={() =>
                      updateQuantity(
                        product._id,
                        variant.weight,
                        quantity - 1
                      )
                    }
                    disabled={quantity <= 1}
                  >
                    –
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        product._id,
                        variant.weight,
                        quantity + 1
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="cs-item-right">
                <span>
                  Rs.{' '}
                  {(
                    (variant.discountedPrice || variant.price) * quantity
                  ).toFixed(2)}
                </span>
                <button
                  className="cs-remove"
                  onClick={() =>
                    removeFromCart(product._id, variant.weight)
                  }
                  aria-label="Remove item"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <footer className="cs-footer">
          <div className="cs-subtotal">
            <strong>Subtotal</strong>
            <span>Rs. {subtotal}</span>
          </div>
          <button
            className="cs-checkout"
            disabled={cart.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
}
