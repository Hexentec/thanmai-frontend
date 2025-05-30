// app/components/CategoriesGrid.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link   from 'next/link';
import Image  from 'next/image';
import ImageWithFallback from './ImageWithFallback';
import api    from '../lib/api';
import '../../styles/components/CategoriesGrid.css';
import { motion } from 'framer-motion';
import { slideUp } from '../lib/animationVariants';

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
    <motion.section
      className="categories-section"
      aria-label="Product Categories"
      role="region"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <h2 className="categories-title">Love Our Categories</h2>
      <div className="categories-grid" role="list">
        {displayCats.map((cat, i) => (
          <motion.div
            key={cat._id}
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link href={`/shop/${cat.slug}`} role="listitem" aria-label={cat.name}>
              <motion.div
                className="category-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.1 * i, duration: 0.5, ease: 'easeOut' }}
                whileHover={{ scale: 1.06, boxShadow: '0 8px 32px rgba(160,29,70,0.13)' }}
                whileTap={{ scale: 0.97 }}
              >
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
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
