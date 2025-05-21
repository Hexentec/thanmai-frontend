// src/components/Navbar.jsx
"use client";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { CartContext } from "../context/CartContext";
import "../../styles/components/Navbar.css";

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link href="/">
          <img src="/assets/logo.png" alt="Logo" />
        </Link>
      </div>
      <div className={`navbar-links ${isOpen ? "open" : ""}`}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/shop/veg">Veg</Link>
        <Link href="/shop/non-veg">Non-Veg</Link>
        <Link href="/must-try">Must Try</Link>
        <Link href="/bulk-orders">Bulk Orders</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </div>
      <div className="navbar-cart" onClick={() => setIsOpen(!isOpen)}>
        <span>Cart ({cartItems.length})</span>
      </div>
      <div className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};

export default Navbar;
