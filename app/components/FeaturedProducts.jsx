'use client';

import React, { useState, useEffect } from 'react';
import Link   from 'next/link';
import Image  from 'next/image';
import { useCart } from '../context/CartContext';
import api    from '../lib/api';
import '../../styles/components/FeaturedProducts.css';

const featuredProducts = [
  {
    name: "Lemon Pickle",
    image: "/assets/dummy1.png",
    link: "/product/Lemon-Pickle",
  },
  {
    name: "Boneless Chicken Pickle",
    image: "/assets/dummy2.png",
    link: "/product/Boneless-Chicken-Pickle",
  },
  {
    name: "Test Pickle",
    image: "/assets/dummy-veg.png",
    link: "/product/Test-Pickle",
  },
];

const FeaturedProducts = () => {
  return (
    <div className="featured-products">
      {featuredProducts.map((product) => (
        <Link href={product.link} key={product.name} className="featured-product-card">
          <img src={product.image} alt={product.name} />
          <span>{product.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedProducts;

function FeaturedCard({ product }) {
  const { addToCart } = useCart();
  const variants       = product.variants || [];
  const firstVar       = variants[0] || { weight:'', price:0, discountedPrice:0 };

  const [selectedVar, setSelectedVar] = useState(firstVar);
  const [quantity, setQuantity]       = useState(1);

  const onVariantChange = e => {
    const v = variants.find(v => v.weight === e.target.value) || firstVar;
    setSelectedVar(v);
    setQuantity(1);
  };

  const dec = () => setQuantity(q => Math.max(1, q - 1));
  const inc = () => setQuantity(q => q + 1);

  const unitPrice  = selectedVar.discountedPrice || selectedVar.price;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  const handleAdd = () => {
    addToCart({ product, variant: selectedVar, quantity });
    setQuantity(1);
  };

  const imgSrc = product.images?.[0] || '/assets/placeholder.png';

  return (
    <div className="fp-card">
      <div className="fp-image-wrapper">
        <Link href={`/product/${product.slug}`}>
          
            <Image src={imgSrc} alt={product.name} width={300} height={300} />
          
        </Link>
      </div>

      <div className="fp-info">
        <p className="fp-category">{product.category?.name}</p>

        <h3 className="fp-name">
          <Link href={`/product/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        <div className="fp-controls">
          <select
            className="fp-variant"
            value={selectedVar.weight}
            onChange={onVariantChange}
          >
            {variants.map(v => (
              <option key={v.weight} value={v.weight}>
                {v.weight}
              </option>
            ))}
          </select>

          <div className="fp-qty">
            <button type="button" onClick={dec}>–</button>
            <span>{quantity}</span>
            <button type="button" onClick={inc}>+</button>
          </div>
        </div>

        <div className="fp-footer">
          <span className="fp-price">Rs. {totalPrice}</span>
          <button
            type="button"
            className="fp-add-btn"
            onClick={handleAdd}
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}
