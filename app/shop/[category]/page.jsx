// app/shop/[category]/page.jsx
'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../lib/api";
import "../../../styles/pages/Category.css";

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
        <h1>{category} Products</h1>
        <div className="category-products">
          {products.map(product => (
            <div key={product.slug} className="category-product-item">
              <img src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
