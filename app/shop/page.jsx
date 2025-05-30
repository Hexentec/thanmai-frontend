'use client';

import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import useProductFilter from '../lib/useProductFilter';
import ProductCard from '../components/ProductCard';
import '../../styles/pages/Category.css';

export default function ShopPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // array of category _id
  const [filters, setFilters] = useState({ inStock: true, outOfStock: false, tag: '' });
  const [viewMode, setViewMode] = useState(4);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data || []));
    api.get('/products').then(r => setProducts(Array.isArray(r.data) ? r.data.filter(p => p && p.variants && p.variants.length > 0) : []));
  }, []);

  // Filter by selected categories
  const categoryFiltered = selectedCategories.length > 0
    ? products.filter(p => p.category && selectedCategories.includes(p.category._id))
    : products;
  const filtered = useProductFilter(categoryFiltered, filters, sortBy);

  // Unique tags from products
  const tags = Array.from(new Set(products.flatMap(p => p.tags || [])));

  // Category selection logic
  const toggleCategory = (catId) => {
    setSelectedCategories(sel => sel.includes(catId)
      ? sel.filter(id => id !== catId)
      : [...sel, catId]
    );
  };

  return (
    <div className="shop-category-page">
      {/* Sidebar filters */}
      <aside className="filters-sidebar">
        <div className="filter-section">
          <h3>Categories</h3>
          {categories.map(cat => (
            <label key={cat._id}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat._id)}
                onChange={() => toggleCategory(cat._id)}
              />
              {cat.name}
            </label>
          ))}
        </div>
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
      {/* Main content */}
      <section className="products-main">
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
        <div
          className="products-grid"
          style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${100 / viewMode}%,1fr))` }}
        >
          {filtered.map((prod, i) => (
            <ProductCard key={prod._id} product={prod} categoryName={prod.category?.name} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
} 