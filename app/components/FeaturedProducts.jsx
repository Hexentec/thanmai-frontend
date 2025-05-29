'use client';

import React, { useState, useEffect } from 'react';
import Link   from 'next/link';
import Image  from 'next/image';
import { useCart } from '../context/CartContext';
import api    from '../lib/api';
import '../../styles/components/FeaturedProducts.css';

export default function FeaturedProducts() {
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat]   = useState(null);
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(false);

  useEffect(() => {
    api.get('/categories')
      .then(res => {
        setCategories(res.data);
        if (res.data.length) setActiveCat(res.data[0]._id);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!activeCat) return;
    setLoading(true);
    api.get(`/products?category=${activeCat}&featured=true`)
      .then(res => {
        // Fallback: filter for isFeatured and correct category on frontend
        setProducts((res.data || []).filter(p => p.isFeatured && p.category && p.category._id === activeCat));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeCat]);

  return (
    <section className="featured-products" aria-label="Featured Products" role="region">
      <h2 className="fp-title">Featured Products</h2>

      <div className="fp-tabs" role="tablist" aria-label="Featured Product Categories">
        {categories.map(cat => (
          <button
            key={cat._id}
            className={cat._id === activeCat ? 'active' : ''}
            onClick={() => setActiveCat(cat._id)}
            role="tab"
            aria-selected={cat._id === activeCat}
            aria-controls={`fp-panel-${cat._id}`}
            tabIndex={cat._id === activeCat ? 0 : -1}
            style={{ fontWeight: cat._id === activeCat ? 'bold' : 'normal', borderBottom: cat._id === activeCat ? '2px solid #333' : 'none' }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="fp-grid">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>Loading…</div>
        ) : products.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>No featured products found.</div>
        ) : (
          products.map(prod => (
            <FeaturedCard key={prod._id} product={prod} />
          ))
        )}
      </div>
    </section>
  );
}


function FeaturedCard({ product }) {
  const { addToCart } = useCart();
  const variants       = product.variants || [];
  const firstVar       = variants[0] || { weight:'', price:0, discountedPrice:0 };

  const [selectedVar, setSelectedVar] = useState(firstVar);
  const [quantity, setQuantity]       = useState(1);

  const onVariantChange = e => {
    const v = variants.find(v => v.weight === e.target.value) || firstVar;
    setSelectedVar(v);
    setQuantity(1);
  };

  const dec = () => setQuantity(q => Math.max(1, q - 1));
  const inc = () => setQuantity(q => q + 1);

  const unitPrice  = selectedVar.discountedPrice || selectedVar.price;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  const handleAdd = () => {
    addToCart({ product, variant: selectedVar, quantity });
    setQuantity(1);
  };

  const imgSrc = product.images?.[0] || '/assets/placeholder.png';
  const hasDiscount = selectedVar.discountedPrice && selectedVar.discountedPrice < selectedVar.price;

  return (
    <div className="fp-card" role="listitem" aria-label={product.name}>
      <div className="fp-image-wrapper">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <Image src={imgSrc} alt={product.name} width={300} height={300} className="fp-image" priority />
        </Link>
        {/* Optionally add badge for discount */}
        {hasDiscount && <span className="fp-discount-badge">Sale</span>}
      </div>

      <div className="fp-info">
        <p className="fp-category">{product.category?.name}</p>

        <h3 className="fp-name">
          <Link href={`/product/${product.slug}`} aria-label={product.name}>
            {product.name}
          </Link>
        </h3>

        <div className="fp-controls">
          <select
            className="fp-variant"
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

          <div className="fp-qty" aria-label="Quantity selector">
            <button type="button" onClick={dec} aria-label="Decrease quantity">–</button>
            <span>{quantity}</span>
            <button type="button" onClick={inc} aria-label="Increase quantity">+</button>
          </div>
        </div>

        <div className="fp-footer">
          <span className="fp-price">
            Rs. {totalPrice}
            {hasDiscount && (
              <span className="fp-old-price">Rs. {selectedVar.price}</span>
            )}
          </span>
          <button
            type="button"
            className="fp-add-btn"
            onClick={handleAdd}
            aria-label={`Add ${quantity} ${product.name} to cart`}
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}
