// src/components/Navbar.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiMenu,
  FiSearch,
  FiUser,
  FiShoppingCart
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import api from '../lib/api';
import '../../styles/components/Navbar.css';

export default function Navbar() {
  const [texts, setTexts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalQuantity, openCart } = useCart();

  const router   = useRouter();
  const pathname = usePathname();

  // Track login state on each route change
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [pathname]);

  // Load marquee texts
  useEffect(() => {
    api.get('/site-settings')
      .then(res => setTexts(res.data.marqueeTexts || []))
      .catch(console.error);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(o => !o);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
    router.push('/');
  };

  // Build login link with redirect back
  const loginHref = `/login?redirect=${encodeURIComponent(pathname)}`;

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
          {isLoggedIn ? (
            <Link href="/" className="nav-logout" onClick={handleLogout}>
              <FiUser size={20} /> Logout
            </Link>
          ) : (
            <Link href={loginHref}>
              <FiUser size={20} /> Login
            </Link>
          )}

          <button
            className="cart-button"
            onClick={openCart}
          >
            <FiShoppingCart size={20} /> Cart
            {totalQuantity > 0 && (
              <span className="cart-badge">{totalQuantity}</span>
            )}
          </button>
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
            {isLoggedIn ? (
              <Link href="/" className="nav-logout" onClick={handleLogout}>
                <FiUser size={20} />
              </Link>
            ) : (
              <Link href={loginHref}><FiUser size={20} /></Link>
            )}
            <button
              className="cart-button"
              onClick={openCart}
            >
              <FiShoppingCart size={20} />
              {totalQuantity > 0 && (
                <span className="cart-badge">{totalQuantity}</span>
              )}
            </button>
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
        <Link href="/contact">Contact</Link>
      </nav>
    </>
  );
}
