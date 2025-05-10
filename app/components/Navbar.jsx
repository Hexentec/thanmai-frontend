'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiMenu,
  FiSearch,
  FiHeart,
  FiUser,
  FiShoppingCart
} from 'react-icons/fi';
import api from '../lib/api';
import '../../styles/components/Navbar.css';

export default function Navbar() {
  const [texts, setTexts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    api.get('/site-settings')
      .then(res => setTexts(res.data.marqueeTexts || []))
      .catch(console.error);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(open => !open);
  };

  return (
    <>
      {/* Top marquee */}
      <div className="navbar-top">
        <div className="marquee">
          <div className="marquee-content">
            {texts.map((t, i) => (
              <span key={i}>{t}&nbsp;&nbsp;&nbsp;</span>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Middle Nav */}
      <div className="navbar-middle navbar-desktop">
        <div className="logo">
          <Link href="/"><img src="/assets/logo.png" alt="Logo" /></Link>
        </div>
        <div className="search">
          <input type="text" placeholder="Search pickles." />
          <button type="button"><FiSearch size={20} /></button>
        </div>
        <div className="links">
          <Link href="/wishlist"><FiHeart size={20} /> Wishlist</Link>
          <Link href="/account"><FiUser size={20} /> Account</Link>
          <Link href="/cart"><FiShoppingCart size={20} /> Cart</Link>
        </div>
      </div>

      {/* Mobile Middle Nav */}
      <div className="navbar-middle navbar-mobile">
        <div className="mobile-top">
          <button 
            className={`hamburger${mobileMenuOpen ? ' open' : ''}`}
            onClick={toggleMobileMenu}
          >
            <FiMenu size={24} />
          </button>
          <Link href="/"><img src="/assets/logo.png" alt="Logo" className="mobile-logo" /></Link>
          <div className="icons">
            <Link href="/wishlist"><FiHeart size={20} /></Link>
            <Link href="/account"><FiUser size={20} /></Link>
            <Link href="/cart"><FiShoppingCart size={20} /></Link>
          </div>
        </div>
        <div className="mobile-search">
          <input type="text" placeholder="Search pickles." />
          <button type="button"><FiSearch size={20} /></button>
        </div>
      </div>

      {/* Bottom nav (shared) */}
      <nav className={`navbar-bottom${mobileMenuOpen ? ' mobile-open' : ''}`}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>

        <div className="dropdown">
          <span>Shop by Category</span>
          <div className="dropdown-menu">
            <Link href="/shop/veg-pickles">Veg Pickles</Link>
            <Link href="/shop/non-veg-pickles">Non-Veg Pickles</Link>
          </div>
        </div>

        <Link href="/must-try">Must Try</Link>
        <Link href="/bulk-orders">Bulk Orders</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </>
  );
}
