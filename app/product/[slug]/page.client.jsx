'use client';

import React, { useState, useEffect } from 'react';
import { useParams }       from 'next/navigation';
import Image               from 'next/image';
import { useCart }         from '../../context/CartContext';
import api                 from '../../lib/api';
import '../../../styles/pages/Product.css';



export default function ProductPage({ slug }) {
 
  const { addToCart } = useCart();

  const [product, setProduct]   = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get('/products')
      .then(res => {
        const p = res.data.find(p => p.slug === slug);
        if (p) {
          setProduct(p);
          setMainImage(p.images[0] || '/assets/placeholder.png');
          if (p.variants.length) {
            setSelectedWeight(p.variants[0].weight);
          }
        }
      })
      .catch(console.error);
  }, [slug]);

  if (!product) {
    return <p className="pd-loading">Loading…</p>;
  }

  const variant = product.variants.find(v => v.weight === selectedWeight) || product.variants[0];
  const unitPrice = variant.discountedPrice || variant.price;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  const dec = () => setQuantity(q => Math.max(1, q-1));
  const inc = () => setQuantity(q => q+1);

  const handleAdd = () => {
    addToCart({ product, variant, quantity });
    setQuantity(1);
  };

  return (
    <div className="product-page">
      <div className="pd-gallery">
        <div className="pd-main">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className="pd-thumbs">
          {product.images.map((img,i) => (
            <div
              key={i}
              className={`pd-thumb ${img===mainImage?'active':''}`}
              onClick={()=> setMainImage(img)}
            >
              <Image src={img} alt={`${product.name} ${i}`} width={80} height={80}/>
            </div>
          ))}
        </div>
      </div>

      <div className="pd-info">
        <h1 className="pd-title">{product.name}</h1>
        <div className="pd-sku-stock">
          <span className="pd-sku">SKU: {product.slug.toUpperCase()}</span>
          <span className="pd-stock">IN STOCK</span>
        </div>

        <div className="pd-price-section">
          <span className="pd-price">Rs. {unitPrice.toFixed(2)}</span>
        </div>

       {/* <div className="pd-fb-section">
          <h3>Frequently Bought Together</h3>
          {/* You can inject a list here 
        </div> */}

        <hr/>

        <div className="pd-weight">
          <label>Weight:</label>
          <div className="pd-weight-buttons">
            {product.variants.map(v=>(
              <button
                key={v.weight}
                className={v.weight===selectedWeight?'active':''}
                onClick={()=>{setSelectedWeight(v.weight);setQuantity(1);}}
              >
                {v.weight.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="pd-quantity-add">
          <div className="pd-qty">
            <button onClick={dec}>–</button>
            <span>{quantity}</span>
            <button onClick={inc}>+</button>
          </div>
          <button className="pd-add" onClick={handleAdd}>
            <span>Add to cart</span>
          </button>
          <button className="pd-buy">
            Buy it now
          </button>
        </div>

        <div className="pd-actions">
          <button>Ask a question</button>
          <button>Share</button>
        </div>

        <div className="pd-benefits">
          <div>
            <strong>🚚</strong> Free shipping across India
          </div>
          <div>
            <strong>💬</strong> Reliable support
          </div>
        </div>

        <div className="pd-delivery">
          Estimated delivery: May 15 – May 19
        </div>

        <div className="pd-accordion">
          <details>
            <summary>Product description</summary>
            <p>{product.description}</p>
          </details>
          <details>
            <summary>Additional information</summary>
            <p>Ingredients: {product.ingredients}</p>
          </details>
          <details>
            <summary>Shipping and return</summary>
            <p>Standard shipping estimate and returns.</p>
          </details>
          
        </div>
      </div>
    </div>
  );
}
