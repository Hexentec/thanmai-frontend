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

// Top Marquee Component
const TopMarquee = ({ texts }) => (
  <motion.header className="navbar-top" aria-label="Site Announcements" variants={fade} initial="hidden" animate="visible">
    <div className="marquee">
      <div className="marquee-content">
        {texts.map((t, i) => (
          <motion.span key={i} variants={fade} initial="hidden" animate="visible" transition={{ delay: 0.1 * i }}>{t}&nbsp;&nbsp;&nbsp;</motion.span>
        ))}
      </div>
    </div>
  </motion.header>
);

// Search Component
const SearchBar = ({ search, setSearch, searchOpen, setSearchOpen, searchResults, searchRef }) => (
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
);

// Desktop Navigation Links
const DesktopNavLinks = ({ isLoggedIn, loginHref, totalQuantity, openCart, handleLogout }) => (
  <div className="links">
    {isLoggedIn ? (
      <button onClick={handleLogout} className="nav-link">Logout</button>
    ) : (
      <Link href={loginHref} className="nav-link">
        <FiUser size={20} /> Login
      </Link>
    )}
    <button onClick={openCart} className="cart-button">
      <FiShoppingCart size={20} />
      {totalQuantity > 0 && (
        <span className="cart-badge">{totalQuantity}</span>
      )}
    </button>
  </div>
);

// Desktop Bottom Navbar
const DesktopBottomNav = ({ categories }) => (
  <nav className="navbar-bottom">
    <Link href="/">Home</Link>
    <Link href="/about">About</Link>
    <Link href="/must-try">Must Try</Link>
    <Link href="/bulk-orders">Bulk Orders</Link>
    <Link href="/contact">Contact</Link>
    <Link href="/blog">Blog</Link>
    <div className="dropdown">
      <span>Categories</span>
      <div className="dropdown-menu">
        {categories.map(category => (
          <Link 
            key={category._id} 
            href={`/shop?category=${category.slug}`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  </nav>
);

// Mobile Navigation
const MobileNav = ({ mobileMenuOpen, toggleMobileMenu, categories, dropdownOpen, setDropdownOpen, dropdownRef }) => (
  <nav className="navbar-middle navbar-mobile">
    <div className="mobile-top">
      <button
        className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
        onClick={toggleMobileMenu}
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      <Link href="/" className="mobile-logo">
        <ImageWithFallback
          src="/assets/logo.png"
          alt="Thanmai Home Foods Logo"
          width={120}
          height={44}
          nextImage={true}
          priority
        />
      </Link>
    </div>
    <div className={`navbar-bottom ${mobileMenuOpen ? 'mobile-open' : ''}`}> 
      <button className="mobile-close-button" onClick={toggleMobileMenu} aria-label="Close menu">
        <FiX size={24} />
      </button>
      {/* Main page links */}
      <div className="mobile-pages">
        <Link href="/" className="mobile-category-link" onClick={toggleMobileMenu}>Home</Link>
        <Link href="/about" className="mobile-category-link" onClick={toggleMobileMenu}>About</Link>
        <Link href="/must-try" className="mobile-category-link" onClick={toggleMobileMenu}>Must Try</Link>
        <Link href="/bulk-orders" className="mobile-category-link" onClick={toggleMobileMenu}>Bulk Orders</Link>
        <Link href="/contact" className="mobile-category-link" onClick={toggleMobileMenu}>Contact</Link>
        <Link href="/blog" className="mobile-category-link" onClick={toggleMobileMenu}>Blog</Link>
      </div>
      {/* Categories below main links */}
      <div className="mobile-categories">
        <span className="mobile-categories-title">Categories</span>
        <div className="mobile-category-list">
          {categories.map(category => (
            <Link
              key={category._id}
              href={`/shop?category=${category.slug}`}
              className="mobile-category-link"
              onClick={toggleMobileMenu}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </nav>
);

// Main Navbar Component
export default function Navbar() {
  const [texts, setTexts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalQuantity, openCart } = useCart();
  const router = useRouter();
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

  // Search logic with debounce
  useEffect(() => {
    if (!search) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
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
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [search, allProducts, categories]);

  // Close search dropdown on outside click
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
      <TopMarquee texts={texts} />
      
      {/* Desktop Navigation */}
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
        
        <SearchBar
          search={search}
          setSearch={setSearch}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          searchResults={searchResults}
          searchRef={searchRef}
        />
        
        <DesktopNavLinks
          isLoggedIn={isLoggedIn}
          loginHref={loginHref}
          totalQuantity={totalQuantity}
          openCart={openCart}
          handleLogout={handleLogout}
        />
      </motion.nav>

      {/* Desktop Bottom Nav */}
      <DesktopBottomNav categories={categories} />

      {/* Mobile Navigation */}
      <MobileNav
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        categories={categories}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        dropdownRef={dropdownRef}
      />
    </>
  );
}
