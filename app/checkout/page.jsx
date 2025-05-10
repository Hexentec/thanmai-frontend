'use client';
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../../styles/pages/Checkout.css';

export default function CheckoutPage() {
  return (
    <>
      
      <main className="checkout-page">
        <h1>Checkout</h1>
        {/* 
          Left: Shipping form (address, country select)
          Right: Cart summary, coupon input, total, Razorpay button
        */}
      </main>
      
    </>
  );
}
