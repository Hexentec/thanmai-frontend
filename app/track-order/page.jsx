'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import '../../styles/pages/TrackOrder.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { motion } from 'framer-motion';
import { fade } from '../lib/animationVariants';

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/orders/track/${orderNumber}`);
      setOrder(data);
    } catch (err) {
      setError('Order not found. Please check your order number and try again.');
      setOrder(null);
    }
    setLoading(false);
  };

  return (
    <motion.div variants={fade} initial="hidden" animate="visible">
      <main className="track-order-page">
        <h1>Track Your Order</h1>
        
        <form onSubmit={handleSubmit} className="track-order-form">
          <label>
            Order Number
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter your order number"
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {order && (
          <div className="order-details">
            <h2>Order Details</h2>
            <div className="order-info">
              <p><strong>Order Number:</strong> {order.orderNumber}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
            </div>

            <div className="order-items">
              <h3>Items</h3>
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <ImageWithFallback
                    src={item.product.image}
                    alt={item.product.name}
                    width={80}
                    height={80}
                  />
                  <div className="item-details">
                    <p className="item-name">{item.product.name}</p>
                    <p className="item-variant">{item.variant.name}</p>
                    <p className="item-quantity">Quantity: {item.quantity}</p>
                    <p className="item-price">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="shipping-info">
              <h3>Shipping Information</h3>
              <p><strong>Name:</strong> {order.shipping.firstName} {order.shipping.lastName}</p>
              <p><strong>Address:</strong> {order.shipping.address}</p>
              <p><strong>City:</strong> {order.shipping.city}</p>
              <p><strong>State:</strong> {order.shipping.state}</p>
              <p><strong>PIN Code:</strong> {order.shipping.zip}</p>
              <p><strong>Phone:</strong> {order.shipping.phone}</p>
            </div>
          </div>
        )}
      </main>
    </motion.div>
  );
} 