'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import api from '../lib/api';
import '../../styles/pages/Checkout.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { motion } from 'framer-motion';
import { fade } from '../lib/animationVariants';
import { FiTrash2, FiMinus, FiPlus, FiCheckCircle } from 'react-icons/fi';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, updateQuantity, removeFromCart } = useCart();
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
  const [error, setError] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

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
    setError('');
    setSuccess(false);
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
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Order creation failed:', err);
      alert('Failed to create order. Please try again.');
    }
    setLoading(false);
  };

  // Coupon logic (dummy, replace with real API if available)
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setError('');
    if (coupon.toLowerCase() === 'thanmai10') {
      setDiscount(subtotal * 0.1);
      setCouponApplied(true);
    } else {
      setError('Invalid coupon code.');
      setCouponApplied(false);
      setDiscount(0);
    }
  };

  const total = subtotal - discount;

  return (
    <motion.div variants={fade} initial="hidden" animate="visible">
      <main className="checkout-page">
        <motion.div className="checkout-left" initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
          <h1>Checkout</h1>
          {error && <motion.div className="checkout-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.div>}
          {success && <motion.div className="checkout-success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300 }}><FiCheckCircle size={32} color="#27ae60" /> Order placed successfully!</motion.div>}
          <form onSubmit={handleSubmit} autoComplete="on">
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
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
            </motion.section>
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
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
            </motion.section>
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2>Coupon</h2>
              <form className="coupon-form" onSubmit={handleApplyCoupon} style={{marginBottom: '1rem'}}>
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  disabled={couponApplied}
                />
                <button type="submit" disabled={couponApplied}>Apply</button>
              </form>
              {couponApplied && <div className="coupon-success">Coupon applied! 10% off.</div>}
            </motion.section>
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
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
            </motion.section>
            <motion.button type="submit" className="pay-now-btn vibrant-btn" disabled={loading || processing} whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.03, backgroundColor: '#8e1a3d' }}>
              {loading || processing ? <span className="spinner"></span> : `Pay ₹${total.toFixed(2)}`}
            </motion.button>
            <div className="policies">
              <a href="/refund-policy">Refund policy</a>
              <a href="/privacy-policy">Privacy policy</a>
              <a href="/cancellation-policy">Cancellation policy</a>
            </div>
          </form>
        </motion.div>
        <motion.div className="checkout-right" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
          <motion.div className="order-summary sticky-order-summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2>Order Summary</h2>
            <div className="cart-items">
              {cart.length === 0 && <div className="cart-empty">Your cart is empty.</div>}
              {cart.map((item, index) => (
                <motion.div key={index} className="cart-item" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.05 * index }}>
                  <ImageWithFallback
                    src={item.product.images?.[0] || '/assets/placeholder.png'}
                    alt={item.product.name}
                    width={60}
                    height={60}
                  />
                  <div className="item-details">
                    <p className="item-name">{item.product.name}</p>
                    <p className="item-variant">{item.variant.weight}</p>
                    <div className="item-qty-controls">
                      <button type="button" onClick={() => updateQuantity(item.product._id, item.variant.weight, item.quantity - 1)} disabled={item.quantity <= 1}><FiMinus /></button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.product._id, item.variant.weight, item.quantity + 1)}><FiPlus /></button>
                    </div>
                  </div>
                  <div className="item-price vibrant-text">₹{((item.variant.discountedPrice || item.variant.price) * item.quantity).toFixed(2)}</div>
                  <button className="remove-item-btn" type="button" onClick={() => removeFromCart(item.product._id, item.variant.weight)} aria-label="Remove item"><FiTrash2 /></button>
                </motion.div>
              ))}
            </div>
            <div className="order-total">
              <div className="summary-line"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
              {discount > 0 && <div className="summary-line vibrant-text"><span>Discount:</span><span>-₹{discount.toFixed(2)}</span></div>}
              <div className="summary-line"><span>Shipping:</span><span>Calculated at next step</span></div>
              <div className="summary-total vibrant-text"><span>Total:</span><span>₹{total.toFixed(2)}</span></div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}
