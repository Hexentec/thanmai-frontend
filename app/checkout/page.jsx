'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import api from '../lib/api';
import '../../styles/pages/Checkout.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { motion } from 'framer-motion';
import { fade } from '../lib/animationVariants';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    suite: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    saveInfo: false
  });
  const [country, setCountry] = useState('India');
  const [billingSame, setBillingSame] = useState(true);
  const [coupon, setCoupon] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.variant.discountedPrice || item.variant.price) * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/orders/create', {
        items: cart.map(item => ({
          product: item.product._id,
          variant: item.variant._id,
          quantity: item.quantity
        })),
        shipping: {
          firstName: form.firstName,
          lastName: form.lastName,
          address: form.address,
          suite: form.suite,
          city: form.city,
          state: form.state,
          zip: form.zip,
          phone: form.phone,
          country: country
        },
        email: form.email,
        payment: {
          method: 'razorpay'
        }
      });

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Thanmai Home Foods",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            await api.post('/orders/verify-payment', {
              orderId: data.orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });
            clearCart();
            router.push(`/track-order?order=${data.orderNumber}`);
          } catch (err) {
            console.error('Payment verification failed:', err);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone
        },
        theme: {
          color: "#A01d46"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Order creation failed:', err);
      alert('Failed to create order. Please try again.');
    }
    setLoading(false);
  };

  return (
    <motion.div variants={fade} initial="hidden" animate="visible">
      <main className="checkout-page">
        <div className="checkout-left">
          <h1>Checkout</h1>

          <form onSubmit={handleSubmit}>
            <h2>Contact information</h2>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <h2>Shipping address</h2>
            <div className="two-cols">
              <label>
                First name
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Last name
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label>
              Address
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Apartment, suite, etc. <span className="optional">(optional)</span>
              <input
                type="text"
                name="suite"
                value={form.suite}
                onChange={handleChange}
              />
            </label>

            <div className="three-cols">
              <label>
                City
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                State
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select State</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Kerala">Kerala</option>
                  {/* Add more states as needed */}
                </select>
              </label>
              <label>
                PIN code
                <input
                  type="text"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label>
              Phone
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="saveInfo"
                checked={form.saveInfo}
                onChange={handleChange}
              />
              Save this information for next time
            </label>

            <h2>Payment</h2>
            <p className="payment-note">All transactions are secure and encrypted.</p>
            <div className="payment-method">
              <div>Razorpay Secure (UPI, Cards, Wallets, NetBanking)</div>
              <div className="payment-logos">
                <span>UPI</span>&nbsp;<span>Visa</span>&nbsp;<span>MC</span>&nbsp;<span>+14</span>
              </div>
              <p className="payment-note">
                After clicking &quot;Pay now&quot;, you will be redirected to Razorpay Secure to complete your purchase.
              </p>
            </div>

            <button type="submit" className="pay-now-btn" disabled={loading}>
              {loading ? 'Processing...' : `Pay ₹${subtotal.toFixed(2)}`}
            </button>

            <div className="policies">
              <a href="/refund-policy">Refund policy</a>
              <a href="/privacy-policy">Privacy policy</a>
              <a href="/cancellation-policy">Cancellation policy</a>
            </div>
          </form>
        </div>

        <div className="checkout-right">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
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
                    <p className="item-price">₹{(item.variant.discountedPrice || item.variant.price) * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
              <p>Shipping: Calculated at next step</p>
              <p className="total">Total: ₹{subtotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
