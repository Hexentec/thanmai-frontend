'use client';

import React, { useState, useEffect } from 'react';
import Link   from 'next/link';
import Image  from 'next/image';
import ImageWithFallback from './ImageWithFallback';
import { useCart } from '../context/CartContext';
import api    from '../lib/api';
import '../../styles/components/FeaturedProducts.css';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { slideUp } from '../lib/animationVariants';

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
    <motion.section className="featured-products" aria-label="Featured Products" role="region"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2 className="fp-title">Featured Products</h2>

      <div className="fp-tabs" role="tablist" aria-label="Featured Product Categories">
        {categories.map(cat => (
          <motion.button
            key={cat._id}
            className={cat._id === activeCat ? 'active' : ''}
            onClick={() => setActiveCat(cat._id)}
            role="tab"
            aria-selected={cat._id === activeCat}
            aria-controls={`fp-panel-${cat._id}`}
            tabIndex={cat._id === activeCat ? 0 : -1}
            style={{ fontWeight: cat._id === activeCat ? 'bold' : 'normal', borderBottom: cat._id === activeCat ? '2px solid #333' : 'none' }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {cat.name}
          </motion.button>
        ))}
      </div>

      <div className="fp-grid">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>Loading…</div>
        ) : products.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>No featured products found.</div>
        ) : (
          <div className="featured-products-grid">
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                variants={slideUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.08 }}
              >
                <ProductCard product={product} categoryName={product.category?.name} index={i} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

function normalizeSlug(slug) {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
