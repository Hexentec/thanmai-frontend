// src/components/Navbar.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiMenu,
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiX
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import api from '../lib/api';
import '../../styles/components/Navbar.css';
import ImageWithFallback from './ImageWithFallback';
import { motion, AnimatePresence } from 'framer-motion';
import { fade, scaleIn } from '../lib/animationVariants';
import blogPosts from '../lib/blogMockData';

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

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
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

  // Only handle dropdown open/close for mobile
  const handleDropdownClick = (e) => {
    if (window.innerWidth <= 768) {
      setDropdownOpen(o => !o);
    }
  };

  // Desktop: open dropdown on hover
  const handleDropdownMouseEnter = () => {
    if (!isMobile) setDropdownOpen(true);
  };
  const handleDropdownMouseLeave = () => {
    if (!isMobile) setDropdownOpen(false);
  };

  // Track screen width for SSR-safe mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Unified search state
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const [allProducts, setAllProducts] = useState([]);
  // Fetch all products for search
  useEffect(() => {
    api.get('/products').then(r => setAllProducts(Array.isArray(r.data) ? r.data : []));
  }, []);
  // Search logic
  useEffect(() => {
    if (!search) {
      setSearchResults([]);
      return;
    }
    const q = search.toLowerCase();
    // Products
    const prodResults = allProducts.filter(p => p.name.toLowerCase().includes(q)).slice(0, 5);
    // Categories
    const catResults = categories.filter(c => c.name.toLowerCase().includes(q)).slice(0, 5);
    // Blogs
    const blogResults = blogPosts.filter(b => b.title.toLowerCase().includes(q) || b.content.toLowerCase().includes(q)).slice(0, 5);
    setSearchResults([
      prodResults.length ? { type: 'Products', items: prodResults } : null,
      catResults.length ? { type: 'Categories', items: catResults } : null,
      blogResults.length ? { type: 'Blog Posts', items: blogResults } : null,
    ].filter(Boolean));
  }, [search, allProducts, categories]);
  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuOpen && !event.target.closest('.navbar-bottom') && !event.target.closest('.hamburger')) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top marquee */}
      <motion.header className="navbar-top" aria-label="Site Announcements" variants={fade} initial="hidden" animate="visible">
        <div className="marquee">
          <div className="marquee-content">
            {texts.map((t, i) => (
              <motion.span key={i} variants={fade} initial="hidden" animate="visible" transition={{ delay: 0.1 * i }}>{t}&nbsp;&nbsp;&nbsp;</motion.span>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Desktop Middle Nav */}
      <motion.nav className="navbar-middle navbar-desktop" aria-label="Main Navigation" variants={fade} initial="hidden" animate="visible">
        <div className="logo">
          <Link href="/" aria-label="Home">
            <ImageWithFallback 
              src="/assets/logo.png" 
              alt="Thanmai Home Foods Logo" 
              width={120}
              height={60}
              nextImage={true}
              priority
            />
          </Link>
        </div>
        <div className="search" ref={searchRef}>
          <input
            type="text"
            placeholder="Search products, categories, blogs..."
            aria-label="Search"
            value={search}
            onChange={e => { setSearch(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
          />
          <button type="button" aria-label="Search"><FiSearch size={20} /></button>
          <AnimatePresence>
            {searchOpen && search && searchResults.length > 0 && (
              <motion.div
                className="search-dropdown"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.18 }}
              >
                {searchResults.map(group => (
                  <div key={group.type} className="search-group">
                    <div className="search-group-title">{group.type}</div>
                    {group.items.map(item => (
                      <Link
                        key={item._id || item.slug}
                        href={
                          group.type === 'Products' ? `/product/${item.slug}` :
                          group.type === 'Categories' ? `/shop` :
                          group.type === 'Blog Posts' ? `/blog/${item.slug}` : '#'
                        }
                        onClick={() => { setSearch(''); setSearchOpen(false); }}
                        className="search-result-link"
                      >
                        {group.type === 'Products' && (
                          <ImageWithFallback
                            src={item.images?.[0] || '/assets/placeholder.png'}
                            alt={item.name}
                            width={32}
                            height={32}
                            className="search-result-image"
                          />
                        )}
                        {group.type === 'Categories' && (
                          <span className="search-category-icon">#</span>
                        )}
                        {group.type === 'Blog Posts' && (
                          <ImageWithFallback
                            src={item.coverImage}
                            alt={item.title}
                            width={32}
                            height={32}
                            className="search-result-image"
                          />
                        )}
                        <span className="search-result-text">
                          {group.type === 'Products' ? item.name : group.type === 'Categories' ? item.name : item.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="links">
          {isLoggedIn ? (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Link href="/" className="nav-logout" onClick={handleLogout} aria-label="Logout">
                <FiUser size={20} /> Logout
              </Link>
            </motion.div>
          ) : (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Link href={loginHref} aria-label="Login">
                <FiUser size={20} /> Login
              </Link>
            </motion.div>
          )}

          <motion.button
            className="cart-button"
            onClick={openCart}
            aria-label={`Cart with ${totalQuantity} items`}
            whileTap={{ scale: 0.95 }}
          >
            <FiShoppingCart size={20} /> Cart
            <AnimatePresence>
              {totalQuantity > 0 && (
                <motion.span
                  className="cart-badge"
                  aria-label={`${totalQuantity} items in cart`}
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key={totalQuantity}
                >
                  {totalQuantity}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Middle Nav */}
      <motion.nav className="navbar-middle navbar-mobile" aria-label="Mobile Navigation" variants={fade} initial="hidden" animate="visible">
        <div className="mobile-top">
          <motion.button 
            className={`hamburger${mobileMenuOpen ? ' open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            whileTap={{ scale: 0.9 }}
          >
            <FiMenu size={28} />
          </motion.button>
          <Link href="/" aria-label="Home">
            <ImageWithFallback 
              src="/assets/logo.png" 
              alt="Thanmai Home Foods Logo" 
              className="mobile-logo"
              width={100}
              height={50}
              nextImage={true}
              priority
            />
          </Link>
          <div className="icons">
            {isLoggedIn ? (
              <motion.div whileTap={{ scale: 0.95 }}>
                <Link href="/" className="nav-logout" onClick={handleLogout} aria-label="Logout">
                  <FiUser size={20} />
                </Link>
              </motion.div>
            ) : (
              <motion.div whileTap={{ scale: 0.95 }}>
                <Link href={loginHref} aria-label="Login"><FiUser size={20} /></Link>
              </motion.div>
            )}
            <motion.button
              className="cart-button"
              onClick={openCart}
              aria-label={`Cart with ${totalQuantity} items`}
              whileTap={{ scale: 0.95 }}
            >
              <FiShoppingCart size={20} />
              <AnimatePresence>
                {totalQuantity > 0 && (
                  <motion.span
                    className="cart-badge"
                    aria-label={`${totalQuantity} items in cart`}
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    key={totalQuantity}
                  >
                    {totalQuantity}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
        <div className="mobile-search" ref={searchRef}>
          <input
            type="text"
            placeholder="Search products, categories, blogs..."
            aria-label="Search"
            value={search}
            onChange={e => { setSearch(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
          />
          <button type="button" aria-label="Search"><FiSearch size={20} /></button>
          <AnimatePresence>
            {searchOpen && search && searchResults.length > 0 && (
              <motion.div
                className="search-dropdown"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.18 }}
              >
                {searchResults.map(group => (
                  <div key={group.type} className="search-group">
                    <div className="search-group-title">{group.type}</div>
                    {group.items.map(item => (
                      <Link
                        key={item._id || item.slug}
                        href={
                          group.type === 'Products' ? `/product/${item.slug}` :
                          group.type === 'Categories' ? `/shop` :
                          group.type === 'Blog Posts' ? `/blog/${item.slug}` : '#'
                        }
                        onClick={() => { setSearch(''); setSearchOpen(false); }}
                        className="search-result-link"
                      >
                        {group.type === 'Products' && (
                          <ImageWithFallback
                            src={item.images?.[0] || '/assets/placeholder.png'}
                            alt={item.name}
                            width={32}
                            height={32}
                            className="search-result-image"
                          />
                        )}
                        {group.type === 'Categories' && (
                          <span className="search-category-icon">#</span>
                        )}
                        {group.type === 'Blog Posts' && (
                          <ImageWithFallback
                            src={item.coverImage}
                            alt={item.title}
                            width={32}
                            height={32}
                            className="search-result-image"
                          />
                        )}
                        <span className="search-result-text">
                          {group.type === 'Products' ? item.name : group.type === 'Categories' ? item.name : item.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Bottom nav (shared) */}
      <motion.nav 
        className={`navbar-bottom${mobileMenuOpen ? ' mobile-open' : ''}`}
        id="mobile-menu"
        aria-label="Category Navigation"
        variants={fade}
        initial="hidden"
        animate={isMobile ? (mobileMenuOpen ? 'visible' : 'hidden') : 'visible'}
      >
        {/* Mobile close button */}
        {isMobile && mobileMenuOpen && (
          <motion.button
            className="mobile-close-button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            whileTap={{ scale: 0.9 }}
          >
            <FiX size={32} />
          </motion.button>
        )}
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/blog">Blog</Link>
        {/* Mobile: show categories as expanded list, Desktop: keep dropdown */}
        {isMobile && mobileMenuOpen ? (
          <div className="mobile-categories">
            <span className="mobile-categories-title">Shop by Category</span>
            <div className="mobile-category-list">
              {categories.map(cat => (
                <Link 
                  key={cat._id} 
                  href={`/shop/${cat.slug}`}
                  className="mobile-category-link"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="dropdown"
            ref={dropdownRef}
            tabIndex={0}
            onClick={handleDropdownClick}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <span tabIndex={0} aria-haspopup="true" aria-expanded={dropdownOpen || undefined}>Shop by Category</span>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  className="dropdown-menu"
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {categories.map(cat => (
                    <Link key={cat._id} href={`/shop/${cat.slug}`}>
                      {cat.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <Link href="/bulk-orders">Bulk Orders</Link>
        <Link href="/contact">Contact</Link>
      </motion.nav>
    </>
  );
}
