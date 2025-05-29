'use client';

import React, { useState } from 'react';
import ImageWithFallback   from '../../components/ImageWithFallback';
import { useCart }         from '../../context/CartContext';
import '../../../styles/pages/Product.css';

export default function ProductPage({ product }) {
  const { addToCart } = useCart();
  const [mainImage, setMainImage] = useState(product?.images?.[0] || '/assets/placeholder.png');
  const [selectedWeight, setSelectedWeight] = useState(product?.variants?.[0]?.weight || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <p className="pd-loading">Product not found.</p>;
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
          <ImageWithFallback
            src={mainImage}
            alt={product.name}
            fill
            style={{ objectFit: 'contain' }}
            nextImage={true}
          />
        </div>
        <div className="pd-thumbs">
          {product.images.map((img,i) => (
            <div
              key={i}
              className={`pd-thumb ${img===mainImage?'active':''}`}
              onClick={()=> setMainImage(img)}
            >
              <ImageWithFallback src={img} alt={`${product.name} ${i}`} width={80} height={80} nextImage={true}/>
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
