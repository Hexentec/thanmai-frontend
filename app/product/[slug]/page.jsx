'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../lib/api';
import '../../../styles/pages/Product.css';

export default function ProductPage() {
  const { slug } = useParams();
  const [prod, setProd] = useState(null);

  useEffect(() => {
    api.get(`/products`)
      .then(res => {
        const found = res.data.find(p => p.slug === slug);
        setProd(found);
      })
      .catch(console.error);
  }, [slug]);

  if (!prod) return <p>Loading…</p>;

  return (
    <>
      
      <main className="product-page">
        <div className="product-detail">
          <img src={prod.images[0]} alt={prod.name} />
          <div className="pd-info">
            <h1>{prod.name}</h1>
            <p>{prod.description}</p>
            {/* Variants, quantity selector, price, Add to Cart button */}
          </div>
        </div>
      </main>
      
    </>
  );
}
