'use client';

import React, { useState, useEffect } from 'react';
import useProductFilter from '../lib/useProductFilter';
import Link   from 'next/link';
import Image  from 'next/image';
import api    from '../lib/api';
import '../../styles/pages/MustTry.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const mustTryProducts = [
  {
    name: "Lemon Pickle",
    image: "/assets/dummy1.png",
    description: "A tangy and spicy lemon pickle.",
  },
  {
    name: "Boneless Chicken Pickle",
    image: "/assets/dummy2.png",
    description: "Delicious boneless chicken pickle.",
  },
];

const MustTryPage = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ inStock: true, outOfStock: false, tag: '' });
  const [viewMode, setViewMode] = useState(4);
  const [sortBy, setSortBy] = useState('featured');

  const filtered = useProductFilter(items, filters, sortBy);

  useEffect(() => {
    api.get('/products?mustTry=true')
      .then(res => setItems(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    let filtered = items;
    // Availability filter
    if (filters.inStock && !filters.outOfStock) {
      filtered = filtered.filter(p => (p.variants[0]?.stock ?? 1) > 0);
    } else if (!filters.inStock && filters.outOfStock) {
      filtered = filtered.filter(p => (p.variants[0]?.stock ?? 1) <= 0);
    }
    // Tag filter
    if (filters.tag) {
      filtered = filtered.filter(p => (p.tags || []).includes(filters.tag));
    }
    // Sorting
    if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => (a.variants[0]?.discountedPrice ?? a.variants[0]?.price ?? 0) - (b.variants[0]?.discountedPrice ?? b.variants[0]?.price ?? 0));
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => (b.variants[0]?.discountedPrice ?? b.variants[0]?.price ?? 0) - (a.variants[0]?.discountedPrice ?? a.variants[0]?.price ?? 0));
    }
    setFiltered(filtered);
  }, [items, filters, sortBy]);

  // Unique tags from products
  const tags = Array.from(new Set(items.flatMap(p => p.tags || [])));

  return (
    <>
      <main className="must-try-page">
        <h1>Must Try Products</h1>
        <div className="must-try-list">
          {mustTryProducts.map((product) => (
            <div key={product.name} className="must-try-item">
              <img src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default MustTryPage;
