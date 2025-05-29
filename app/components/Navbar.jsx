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

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCategories([]));
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
      <header className="navbar-top" aria-label="Site Announcements">
        <div className="marquee">
          <div className="marquee-content">
            {texts.map((t, i) => (
              <span key={i}>{t}&nbsp;&nbsp;&nbsp;</span>
            ))}
          </div>
        </div>
      </header>

      {/* Desktop Middle Nav */}
      <nav className="navbar-middle navbar-desktop" aria-label="Main Navigation">
        <div className="logo">
          <Link href="/" aria-label="Home"><img src="/assets/logo.png" alt="Thanmai Home Foods Logo" /></Link>
        </div>
        <form className="search" role="search" aria-label="Search Pickles" onSubmit={e => e.preventDefault()}>
          <input type="text" placeholder="Search pickles." aria-label="Search pickles" />
          <button type="submit" aria-label="Search"><FiSearch size={20} /></button>
        </form>
        <div className="links">
          {isLoggedIn ? (
            <Link href="/" className="nav-logout" onClick={handleLogout} aria-label="Logout">
              <FiUser size={20} /> Logout
            </Link>
          ) : (
            <Link href={loginHref} aria-label="Login">
              <FiUser size={20} /> Login
            </Link>
          )}

          <button
            className="cart-button"
            onClick={openCart}
            aria-label={`Cart with ${totalQuantity} items`}
          >
            <FiShoppingCart size={20} /> Cart
            {totalQuantity > 0 && (
              <span className="cart-badge" aria-label={`${totalQuantity} items in cart`}>{totalQuantity}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Middle Nav */}
      <nav className="navbar-middle navbar-mobile" aria-label="Mobile Navigation">
        <div className="mobile-top">
          <button 
            className={`hamburger${mobileMenuOpen ? ' open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <FiMenu size={28} />
          </button>
          <Link href="/" aria-label="Home"><img src="/assets/logo.png" alt="Thanmai Home Foods Logo" className="mobile-logo" /></Link>
          <div className="icons">
            {isLoggedIn ? (
              <Link href="/" className="nav-logout" onClick={handleLogout} aria-label="Logout">
                <FiUser size={20} />
              </Link>
            ) : (
              <Link href={loginHref} aria-label="Login"><FiUser size={20} /></Link>
            )}
            <button
              className="cart-button"
              onClick={openCart}
              aria-label={`Cart with ${totalQuantity} items`}
            >
              <FiShoppingCart size={20} />
              {totalQuantity > 0 && (
                <span className="cart-badge" aria-label={`${totalQuantity} items in cart`}>{totalQuantity}</span>
              )}
            </button>
          </div>
        </div>
        <form className="mobile-search" role="search" aria-label="Search Pickles" onSubmit={e => e.preventDefault()}>
          <input type="text" placeholder="Search pickles." aria-label="Search pickles" />
          <button type="submit" aria-label="Search"><FiSearch size={20} /></button>
        </form>
      </nav>

      {/* Bottom nav (shared) */}
      <nav className={`navbar-bottom${mobileMenuOpen ? ' mobile-open' : ''}`} id="mobile-menu" aria-label="Category Navigation">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/blog">Blog</Link>
        <div className="dropdown">
          <span tabIndex={0} aria-haspopup="true">Shop by Category</span>
          <div className="dropdown-menu">
            {categories.length > 0 ? (
              categories.map(cat => (
                <Link key={cat._id} href={`/shop/${cat.slug}`}>
                  {cat.name}
                </Link>
              ))
            ) : (
              <>
                <Link href="/shop/veg-pickles">Veg Pickles</Link>
                <Link href="/shop/non-veg-pickles">Non-Veg Pickles</Link>
              </>
            )}
          </div>
        </div>
        <Link href="/must-try">Must Try</Link>
        <Link href="/bulk-orders">Bulk Orders</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </>
  );
}
