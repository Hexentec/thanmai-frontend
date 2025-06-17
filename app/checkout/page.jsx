'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import '../../styles/pages/Checkout.css';
import ImageWithFallback from '../components/ImageWithFallback';

export default function CheckoutPage() {
  const { cart } = useCart();
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

  return (
    <>
      

      <main className="checkout-page">
        {/* ─── LEFT COLUMN ───────────────────────────────────────────────────────── */}
        <div className="checkout-left">
          {/* Contact */}
          <h2>Contact</h2>
          <div className="contact-row">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
           
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="saveInfo"
              checked={form.saveInfo}
              onChange={handleChange}
            />
            Email me with news and offers
          </label>

          {/* Delivery */}
          <h2>Delivery</h2>
          <form className="delivery-form">
            <label>
              Country / Region
              <select value={country} onChange={e => setCountry(e.target.value)}>
                <option>India</option>
                <option>USA</option>
                <option>UK</option>
                {/* etc */}
              </select>
            </label>

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

            <label className="address-search">
              Address
              <input
                type="text"
                name="address"
                placeholder="123 Main St"
                value={form.address}
                onChange={handleChange}
                required
              />
              <button type="button" className="search-btn">🔍</button>
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
                  <option>Maharashtra</option>
                  <option>Tamil Nadu</option>
                  <option>Kerala</option>
                  {/* etc */}
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
                type="text"
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
          </form>

          {/* Shipping method */}
          <h2>Shipping method</h2>
          <div className="shipping-method">
            Enter your shipping address to view available shipping methods.
          </div>

          {/* Payment */}
          <h2>Payment</h2>
          <p className="payment-note">All transactions are secure and encrypted.</p>
          <div className="payment-method">
            <div>Razorpay Secure (UPI, Cards, Wallets, NetBanking)</div>
            <div className="payment-logos">
              {/* You can swap these for real <img> icons */}
              <span>UPI</span>&nbsp;<span>Visa</span>&nbsp;<span>MC</span>&nbsp;<span>+14</span>
            </div>
            <p className="payment-note">
              After clicking &quot;Pay now&quot;, you will be redirected to Razorpay Secure to complete your purchase.
            </p>
          </div>

          {/* Billing address */}
          <h2>Billing address</h2>
          <label className="radio-label">
            <input
              type="radio"
              name="billing"
              checked={billingSame}
              onChange={() => setBillingSame(true)}
            />
            Same as shipping address
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="billing"
              checked={!billingSame}
              onChange={() => setBillingSame(false)}
            />
            Use a different billing address
          </label>

          <button className="pay-now-btn">Pay now</button>

          <div className="policies">
            <a href="/refund-policy">Refund policy</a>
            <a href="/privacy-policy">Privacy policy</a>
            <a href="/cancellation-policy">Cancellation policy</a>
          </div>
        </div>

        {/* ─── RIGHT COLUMN ───────────────────────────────────────────────────────── */}
        <div className="checkout-right">
          <div className="cart-summary">
            {cart.map(item => (
              <div key={item.product._id + item.variant.weight} className="cart-item">
                <ImageWithFallback src={item.product.images[0]} alt={item.product.name} nextImage={false} />
                <div className="item-details">
                  <strong>{item.product.name}</strong>
                  <small>{item.variant.weight}</small>
                </div>
                <div className="item-qty-badge">{item.quantity}</div>
                <div className="item-price">
                  ₹{((item.variant.discountedPrice || item.variant.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            {/* Coupon */}
            <div className="coupon-form">
              <input
                type="text"
                placeholder="Discount code or gift card"
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
              />
              <button>Apply</button>
            </div>

            {/* Totals */}
            <div className="summary-line">
              <span>Subtotal · {cart.reduce((sum, i) => sum + i.quantity, 0)} items</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping</span>
              <span>Enter shipping address</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>INR ₹{subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>

      
    </>
  );
}
