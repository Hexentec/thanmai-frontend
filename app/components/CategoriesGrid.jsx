// app/components/CategoriesGrid.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link   from 'next/link';
import Image  from 'next/image';
import ImageWithFallback from './ImageWithFallback';
import api    from '../lib/api';
import '../../styles/components/CategoriesGrid.css';

export default function CategoriesGrid() {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    api.get('/categories')
      .then(res => setCats(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCats([]));
  }, []);

  // Dummy fallback
  const dummyCats = [
    { _id: 'veg',    slug: 'veg-pickles',    name: 'Vegetable Pickles',       image: '/assets/dummy-veg.png' },
    { _id: 'nonveg', slug: 'non-veg-pickles',name: 'Non-Vegetable Pickles',   image: '/assets/dummy-nonveg.png' },
    // …add more if you like
  ];
  const displayCats = cats.length ? cats : dummyCats;

  return (
    <section className="categories-section" aria-label="Product Categories" role="region">
      <h2 className="categories-title">Love Our Categories</h2>
      <div className="categories-grid" role="list">
        {displayCats.map(cat => (
          <Link key={cat._id} href={`/shop/${cat.slug}`} role="listitem" aria-label={cat.name}>
            <div className="category-card">
              <div className="category-image-wrapper">
                <ImageWithFallback
                  src={cat.image || '/assets/placeholder.png'}
                  alt={cat.name}
                  width={100}
                  height={100}
                  className="category-image"
                  priority
                  nextImage={true}
                />
                {/* Optionally add overlay for future text/icons */}
                {/* <div className="category-overlay">Shop Now</div> */}
              </div>
              <div className="category-name">{cat.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
