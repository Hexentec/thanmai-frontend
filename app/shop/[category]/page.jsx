'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../lib/api';
import '../../../styles/pages/Category.css';

export default function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get(`/products?category=${category}`)
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, [category]);

  return (
    <>
      
      <main className="category-page">
        <h1>Category: {category}</h1>
        <div className="product-grid">
          {products.map(p => (
            <div key={p._id} className="product-card">
              <img src={p.images[0]} alt={p.name} />
              <h2>{p.name}</h2>
              <p>₹{p.variants[0].pricesByCountry['India']}</p>
            </div>
          ))}
        </div>
      </main>
      
    </>
  );
}
