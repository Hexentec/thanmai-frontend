'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '../lib/api';
import '../../styles/components/FeaturedProducts.css';

export default function FeaturedProducts() {
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/categories').then(res => {
      setCategories(res.data);
      if (res.data.length) setActiveCat(res.data[0]._id);
    });
  }, []);

  useEffect(() => {
    if (!activeCat) return;
    api.get(`/products?category=${activeCat}&featured=true`)
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, [activeCat]);

  return (
    <section className="featured-products">
      <h2>Featured Products</h2>
      <div className="fp-tabs">
        {categories.map(cat => (
          <button
            key={cat._id}
            className={cat._id === activeCat ? 'active' : ''}
            onClick={() => setActiveCat(cat._id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="fp-grid">
        {products.map(prod => (
          <div key={prod._id} className="fp-card">
            <div className="fp-image-wrapper">
              <Image
                src={prod.images[0]}
                alt={prod.name}
                width={200}
                height={200}
              />
              <div className="fp-icons">
                {/* Wishlist & QuickView icons */}
              </div>
            </div>
            <p className="fp-category">{prod.category.name}</p>
            <h3 className="fp-name">{prod.name}</h3>
            <div className="fp-controls">
              <select className="fp-variant">
                {prod.variants.map(v => (
                  <option key={v.weight}>{v.weight}</option>
                ))}
              </select>
              <div className="fp-qty">
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
            </div>
            <div className="fp-footer">
              <span className="fp-price">₹{prod.variants[0].pricesByCountry['India']}</span>
              <button className="fp-add-btn">Add</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
