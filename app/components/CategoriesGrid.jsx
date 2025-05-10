// app/components/CategoriesGrid.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '../lib/api';
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
    {
      _id: 'dummy-veg',
      slug: 'veg-pickles',
      name: 'Veg Pickles',
      image: '/assets/dummy-veg.png',
      borderColor: '#A01d46'
    },
    {
      _id: 'dummy-nonveg',
      slug: 'non-veg-pickles',
      name: 'Non-Veg Pickles',
      image: '/assets/dummy-nonveg.png',
      borderColor: '#A01d46'
    }
  ];

  const displayCats = cats.length > 0 ? cats : dummyCats;

  return (
    <section className="categories-section">
      <h2 className="categories-title">Our Loving Categories</h2>
      <div className="categories-grid">
        {displayCats.map(cat => (
          <Link key={cat._id} href={`/shop/${cat.slug}`}>
            <div className="category-card">
              <div
                className="category-image-wrapper"
                style={{ borderColor: cat.borderColor }}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={120}
                  height={120}
                />
              </div>
              <div className="category-name">{cat.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
