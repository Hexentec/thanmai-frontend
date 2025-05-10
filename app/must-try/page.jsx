'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/api';
import '../../styles/pages/MustTry.css';

export default function MustTryPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/products?mustTry=true')
      .then(res => setItems(res.data))
      .catch(console.error);
  }, []);

  return (
    <>
      
      <main className="must-try-page">
        <h1>Must Try</h1>
        <div className="product-grid">
          {items.map(p => (
            <div key={p._id} className="product-card">
              <img src={p.images[0]} alt={p.name} />
              <h2>{p.name}</h2>
            </div>
          ))}
        </div>
      </main>
      
    </>
  );
}
