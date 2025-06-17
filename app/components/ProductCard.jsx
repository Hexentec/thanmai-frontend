import React, { useState } from 'react';
import Link from 'next/link';
import ImageWithFallback from './ImageWithFallback';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { slideUp } from '../lib/animationVariants';
import '../../styles/components/ProductCard.css';

function normalizeSlug(slug) {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Simple cart icon SVG
const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6.5 17a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM3.5 4h1.1l1.3 8.39A2 2 0 0 0 7.88 14h6.49a2 2 0 0 0 1.98-1.61l1.15-5.19A1 1 0 0 0 16.43 6H5.12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.5 6h11" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
);

export default function ProductCard({ product, categoryName, index = 0 }) {
  const { addToCart } = useCart();
  const variants = product.variants || [];
  const firstVar = variants[0] || { weight: '', price: 0, discountedPrice: 0 };
  const [selectedVar, setSelectedVar] = useState(firstVar);
  const [quantity, setQuantity] = useState(1);

  const onVariantChange = e => {
    const v = variants.find(v => v.weight === e.target.value) || firstVar;
    setSelectedVar(v);
    setQuantity(1);
  };
  const dec = () => setQuantity(q => Math.max(1, q - 1));
  const inc = () => setQuantity(q => q + 1);
  const hasDiscount = selectedVar.discountedPrice > 0;
  const unitPrice = selectedVar.price - (hasDiscount ? selectedVar.discountedPrice : 0);
  const totalPrice = (unitPrice * quantity).toFixed(2);
  const handleAdd = () => {
    addToCart({ product, variant: selectedVar, quantity });
    setQuantity(1);
  };
  const imgSrc = product.images?.[0] || '/assets/placeholder.png';

  return (
    <motion.div
      className="product-card"
      variants={slideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 120 }}
      role="listitem"
      aria-label={product.name}
    >
      <div className="pc-image">
        <Link href={`/product/${normalizeSlug(product.slug)}`} aria-label={product.name} tabIndex={-1}>
          <ImageWithFallback src={imgSrc} alt={product.name} width={300} height={300} className="pc-img" priority nextImage={true} />
        </Link>
        {hasDiscount && <span className="pc-discount-badge" aria-label="On Sale">Sale</span>}
      </div>
      <div className="pc-body">
        <h3 className="pc-name">
          <Link href={`/product/${normalizeSlug(product.slug)}`} aria-label={product.name}>
            {product.name}
          </Link>
        </h3>
        <div className="pc-category-under" style={{ fontSize: 13, color: '#8e1a3d', marginBottom: 8, fontWeight: 500 }}>
          {categoryName || product.category?.name}
        </div>
        <div className="pc-controls">
          <select
            className="pc-variant"
            value={selectedVar.weight}
            onChange={onVariantChange}
            aria-label="Select weight variant"
          >
            {variants.map(v => (
              <option key={v.weight} value={v.weight}>
                {v.weight}
              </option>
            ))}
          </select>
          <div className="pc-qty" aria-label="Quantity selector">
            <motion.button type="button" onClick={dec} aria-label="Decrease quantity" whileTap={{ scale: 0.9 }} tabIndex={0}>
              –
            </motion.button>
            <span>{quantity}</span>
            <motion.button type="button" onClick={inc} aria-label="Increase quantity" whileTap={{ scale: 0.9 }} tabIndex={0}>
              +
            </motion.button>
          </div>
        </div>
        <div className="pc-footer">
          <span className="pc-price">
            {(() => {
              const price = selectedVar.price;
              const discounted = selectedVar.discountedPrice;
              // If discounted price is not set or same as price, show just price
              if (!discounted || discounted === price) {
                return <>₹{price}</>;
              }
              // If discount is more than 50%, show just price
              const discountFraction = (price - discounted) / price;
              if (discountFraction > 0.5) {
                return <>₹{price}</>;
              }
              // Otherwise, show price slashed and discounted price
              return <>
                <span className="pc-old-price">₹{price}</span>
                <span>₹{discounted}</span>
              </>;
            })()}
          </span>
          <motion.button
            type="button"
            className="pc-add"
            onClick={handleAdd}
            aria-label={`Add ${quantity} ${product.name} to cart`}
            whileHover={{ scale: 1.08, backgroundColor: '#8e1a3d' }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <CartIcon /> <span>Add</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
} 