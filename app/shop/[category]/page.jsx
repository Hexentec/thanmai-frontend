// app/shop/[category]/page.jsx

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import api from '../../lib/api'
import '../../../styles/pages/Category.css'





// Force SSR (no static export) for this dynamic route
export async function generateStaticParams() {
  const cats = await api.get('/categories').then(r => r.data)
  return cats.map(cat => ({ category: cat.slug }))
}

export default async function ShopCategoryPage({ params }) {
  const slug = params.category  // “veg-pickles” etc.

  // 1) Fetch all categories and pick the one matching slug
  const cats = await api.get('/categories').then(r => r.data)
  const cat  = cats.find(c => c.slug === slug)
  if (!cat) {
    return (
      <p className="shop-loading" style={{ padding: '2rem', textAlign:'center' }}>
        Category “{slug}” not found.
      </p>
    )
  }

  // 2) Fetch products for that category
  const products = await api
    .get(`/products?category=${cat._id}`)
    .then(r => r.data)

  // 3) Render exactly as before
  return (
    <div className="shop-category-page">
      {/* —— Sidebar filters —— */}
      <aside className="filters-sidebar">
        <div className="filter-section">
          <h3>Availability</h3>
          <label>
            <input type="radio" checked readOnly />
            In stock ({products.length})
          </label>
          <label>
            <input type="radio" disabled />
            Out of stock (0)
          </label>
        </div>
        
        <div className="filter-section">
          <h3>Product type</h3>
          <label>
            <input type="checkbox" checked readOnly />
            {cat.name} ({products.length})
          </label>
        </div>
        <div className="filter-section">
          <h3>Tag</h3>
          <button className="tag-btn">
            {cat.name.toLowerCase()}
          </button>
        </div>
      </aside>

      {/* —— Main content —— */}
      <section className="products-main">
        {/* Header */}
        <div className="products-header">
          <div className="ph-info">
            Showing {products.length} products
          </div>

          <div className="ph-view-toggle">
            {[2,3,4].map(n => (
              <button
                key={n}
                className={n === 4 ? 'active' : ''}
                // you can wire up a client hook later if needed
              >
                {'▢'.repeat(n)}
              </button>
            ))}
          </div>

          <div className="ph-sort">
            Sort by:{' '}
            <select defaultValue="featured">
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
            gridTemplateColumns: `repeat(auto-fill, minmax(${100/4}%,1fr))`
          }}
        >
          {products.map(prod => {
            const v     = prod.variants[0] || {}
            const price = (v.discountedPrice ?? v.price ?? 0).toFixed(2)
            return (
              <div key={prod._id} className="product-card">
                <Link
                  href={`/product/${prod.slug}`}
                  className="pc-image"
                >
                  <Image
                    src={prod.images[0] || '/assets/placeholder.png'}
                    alt={prod.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Link>
                <div className="pc-body">
                  <p className="pc-category">{cat.name}</p>
                  <Link
                    href={`/product/${prod.slug}`}
                    className="pc-name"
                  >
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
            )
          })}
        </div>
      </section>
    </div>
  )
}
