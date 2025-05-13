// app/shop/[category]/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams }    from 'next/navigation';
import Link             from 'next/link';
import Image            from 'next/image';
import api              from '../../lib/api';
import '../../../styles/pages/Category.css';

export default function ShopCategoryPage() {
  const { category: slug } = useParams();  // “veg-pickles”, etc.

  const [cat,      setCat]      = useState(null);
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState(4);
  const [sortBy,   setSortBy]   = useState('featured');

  // 1) Load category object
  useEffect(() => {
    api.get('/categories')
      .then(res => {
        const found = res.data.find(c => c.slug === slug);
        setCat(found || null);
      })
      .catch(console.error);
  }, [slug]);

  // 2) Once we have its _id, load products
  useEffect(() => {
    if (!cat?._id) return;
    api.get(`/products?category=${cat._id}`)
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, [cat]);

  // Loading state
  if (!cat) {
    return <p className="shop-loading">Loading category…</p>;
  }

  return (
    <div className="shop-category-page">
      {/* —— Sidebar filters —— */}
      <aside className="filters-sidebar">
        <div className="filter-section">
          <h3>Availability</h3>
          <label><input type="radio" checked readOnly /> In stock ({products.length})</label>
          <label><input type="radio" disabled /> Out of stock (0)</label>
        </div>
        
        <div className="filter-section">
          <h3>Product type</h3>
          <label><input type="checkbox" checked readOnly /> {cat.name} ({products.length})</label>
        </div>
        <div className="filter-section">
          <h3>Tag</h3>
          <button className="tag-btn">{cat.name.toLowerCase()}</button>
        </div>
      </aside>

      {/* —— Main content —— */}
      <section className="products-main">
        {/* Header */}
        <div className="products-header">
          <div className="ph-info">Showing {products.length} products</div>

          <div className="ph-view-toggle">
            {[2,3,4].map(n => (
              <button
                key={n}
                className={viewMode === n ? 'active' : ''}
                onClick={() => setViewMode(n)}
              >{'▢'.repeat(n)}</button>
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
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${100/viewMode}%,1fr))`
          }}
        >
          {products.map(prod => {
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
                      {prod.variants.map(v => (
                        <option key={v.weight}>{v.weight}</option>
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
