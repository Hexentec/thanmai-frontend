// app/shop/[category]/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '../../lib/api';
import '../../../styles/pages/Category.css';

export default function ShopCategoryPage({ params }) {
  const slug = params.category;
  const [cats, setCats] = useState([]);
  const [cat, setCat] = useState(null);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ inStock: true, outOfStock: false, tag: '', });
  const [viewMode, setViewMode] = useState(4);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    api.get('/categories').then(r => {
      setCats(r.data);
      const found = r.data.find(c => c.slug === slug);
      setCat(found);
      if (found) {
        api.get(`/products?category=${found._id}`).then(r2 => {
          setProducts(r2.data);
        });
      }
    });
  }, [slug]);

  useEffect(() => {
    let filtered = products;
    // Availability filter
    if (filters.inStock && !filters.outOfStock) {
      filtered = filtered.filter(p => (p.variants[0]?.stock ?? 1) > 0);
    } else if (!filters.inStock && filters.outOfStock) {
      filtered = filtered.filter(p => (p.variants[0]?.stock ?? 1) <= 0);
    }
    // Tag filter
    if (filters.tag) {
      filtered = filtered.filter(p => (p.tags || []).includes(filters.tag));
    }
    // Sorting
    if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => (a.variants[0]?.discountedPrice ?? a.variants[0]?.price ?? 0) - (b.variants[0]?.discountedPrice ?? b.variants[0]?.price ?? 0));
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => (b.variants[0]?.discountedPrice ?? b.variants[0]?.price ?? 0) - (a.variants[0]?.discountedPrice ?? a.variants[0]?.price ?? 0));
    }
    setFiltered(filtered);
  }, [products, filters, sortBy]);

  if (!cat) {
    return (
      <p className="shop-loading" style={{ padding: '2rem', textAlign: 'center' }}>
        Category “{slug}” not found.
      </p>
    );
  }

  // Unique tags from products
  const tags = Array.from(new Set(products.flatMap(p => p.tags || [])));

  return (
    <div className="shop-category-page">
      {/* —— Sidebar filters —— */}
      <aside className="filters-sidebar">
        <div className="filter-section">
          <h3>Availability</h3>
          <label>
            <input type="radio" checked={filters.inStock && !filters.outOfStock} onChange={() => setFilters(f => ({ ...f, inStock: true, outOfStock: false }))} />
            In stock ({products.filter(p => (p.variants[0]?.stock ?? 1) > 0).length})
          </label>
          <label>
            <input type="radio" checked={!filters.inStock && filters.outOfStock} onChange={() => setFilters(f => ({ ...f, inStock: false, outOfStock: true }))} />
            Out of stock ({products.filter(p => (p.variants[0]?.stock ?? 1) <= 0).length})
          </label>
          <label>
            <input type="radio" checked={filters.inStock && filters.outOfStock} onChange={() => setFilters(f => ({ ...f, inStock: true, outOfStock: true }))} />
            All ({products.length})
          </label>
        </div>
        <div className="filter-section">
          <h3>Product type</h3>
          <label>
            <input type="checkbox" checked readOnly />
            {cat.name} ({products.length})
          </label>
        </div>
        {tags.length > 0 && (
          <div className="filter-section">
            <h3>Tag</h3>
            {tags.map(tag => (
              <button key={tag} className={`tag-btn${filters.tag === tag ? ' active' : ''}`} onClick={() => setFilters(f => ({ ...f, tag: f.tag === tag ? '' : tag }))}>
                {tag}
              </button>
            ))}
          </div>
        )}
      </aside>
      {/* —— Main content —— */}
      <section className="products-main">
        {/* Header */}
        <div className="products-header">
          <div className="ph-info">
            Showing {filtered.length} products
          </div>
          <div className="ph-view-toggle">
            {[2, 3, 4].map(n => (
              <button
                key={n}
                className={viewMode === n ? 'active' : ''}
                onClick={() => setViewMode(n)}
              >
                {'▢'.repeat(n)}
              </button>
            ))}
          </div>
          <div className="ph-sort">
            Sort by:{' '}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low→High</option>
              <option value="price-desc">Price: High→Low</option>
            </select>
          </div>
        </div>
        {/* Product Grid */}
        <div
          className="products-grid"
          style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${100 / viewMode}%,1fr))` }}
        >
          {filtered.map(prod => {
            const v = prod.variants[0] || {};
            const price = (v.discountedPrice ?? v.price ?? 0).toFixed(2);
            return (
              <div key={prod._id} className="product-card">
                <Link href={`/product/${prod.slug}`} className="pc-image">
                  <Image
                    src={prod.images[0] || '/assets/placeholder.png'}
                    alt={prod.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Link>
                <div className="pc-body">
                  <p className="pc-category">{cat.name}</p>
                  <Link href={`/product/${prod.slug}`} className="pc-name">
                    {prod.name}
                  </Link>
                  <div className="pc-controls">
                    <select className="pc-variant">
                      {prod.variants.map(z => (
                        <option key={z.weight}>{z.weight}</option>
                      ))}
                    </select>
                    <div className="pc-qty">
                      <button disabled>–</button>
                      <span>1</span>
                      <button disabled>+</button>
                    </div>
                  </div>
                  <div className="pc-footer">
                    <span className="pc-price">₹{price}</span>
                    <button className="pc-add">ADD</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
