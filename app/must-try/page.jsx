'use client';

import React, { useState, useEffect } from 'react';
import useProductFilter from '../lib/useProductFilter';

import Link   from 'next/link';
import Image  from 'next/image';
import ImageWithFallback from '../components/ImageWithFallback';
import api    from '../lib/api';
import '../../styles/pages/MustTry.css';
import ProductCard from '../components/ProductCard';

export default function MustTryPage() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ inStock: true, outOfStock: false, tag: '' });
  const [viewMode, setViewMode] = useState(4);
  const [sortBy, setSortBy] = useState('featured');
  const filtered = useProductFilter(items, filters, sortBy);

  useEffect(() => {
    api.get('/products?mustTry=true')
      .then(res => setItems(res.data))
      .catch(console.error);
  }, []);

  // Unique tags from products
  const tags = Array.from(new Set(items.flatMap(p => p.tags || [])));

  return (
    <>
      

      <div className="musttry-page">
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h3>Availability</h3>
            <label>
              <input type="radio" checked={filters.inStock && !filters.outOfStock} onChange={() => setFilters(f => ({ ...f, inStock: true, outOfStock: false }))} />
              In stock ({items.filter(p => (p.variants[0]?.stock ?? 1) > 0).length})
            </label>
            <label>
              <input type="radio" checked={!filters.inStock && filters.outOfStock} onChange={() => setFilters(f => ({ ...f, inStock: false, outOfStock: true }))} />
              Out of stock ({items.filter(p => (p.variants[0]?.stock ?? 1) <= 0).length})
            </label>
            <label>
              <input type="radio" checked={filters.inStock && filters.outOfStock} onChange={() => setFilters(f => ({ ...f, inStock: true, outOfStock: true }))} />
              All ({items.length})
            </label>
          </div>

         

          <div className="filter-section">
            <h3>Product type</h3>
            <label>
              <input type="checkbox" checked readOnly />
              Must Try ({items.length})
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

        <section className="products-main">
          <h1 className="musttry-title">Must Try</h1>

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
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low→High</option>
                <option value="price-desc">Price: High→Low</option>
              </select>
            </div>
          </div>

          <div
            className="products-grid"
            style={{
              gridTemplateColumns: `repeat(auto-fill, minmax(${100 / viewMode}%, 1fr))`
            }}
          >
            {filtered.map((prod, i) => (
              <ProductCard key={prod._id} product={prod} categoryName="Must Try" index={i} />
            ))}
          </div>
        </section>
      </div>

      
    </>
  );
}
