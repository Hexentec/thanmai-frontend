'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ImageWithFallback from './ImageWithFallback';
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiMail,
  FiPhone
} from 'react-icons/fi';
import '../../styles/components/Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">

        {/* Section 1: Logo & About */}
        <div className="footer-section">
          <div className="footer-logo">
            <Link href="/"><ImageWithFallback src="/assets/logo.png" alt="Logo" width={120} height={60} nextImage={true} /></Link>
          </div>
          <p className="footer-about">
            Thanmai Home Foods brings you the finest handcrafted pickles, made fresh in small batches with traditional recipes and pure ingredients.
          </p>
        </div>

        {/* Section 2: Pages */}
        <div className="footer-section">
          <h4>Pages</h4>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            
            <li><Link href="/must-try">Must Try</Link></li>
            <li><Link href="/bulk-orders">Bulk Orders</Link></li>
            
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Section 3: Information */}
        <div className="footer-section">
          <h4>Information</h4>
          <ul className="footer-links">
            <li><Link href="/terms">Terms &amp; Conditions</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/refund">Refund Policy</Link></li>
            <li><Link href="/shipping">Shipping Policy</Link></li>
          </ul>
        </div>

        {/* Section 4: Support */}
        <div className="footer-section">
          <h4>Support</h4>
          <ul className="footer-contact">
            <li>
              <FiPhone /> <a href="tel:+917989687713">+91-7989687713</a>
            </li>
            <li>
              <FiMail /> <a href="mailto:support@thanmaihomefoods.com">support@thanmaihomefoods.com</a>
            </li>
          </ul>
          {/* <div className="footer-social">
            <a href="#" aria-label="Facebook"><FiFacebook size={20} /></a>
            <a href="#" aria-label="Instagram"><FiInstagram size={20} /></a>
            <a href="#" aria-label="Twitter"><FiTwitter size={20} /></a>
          </div> */}
        </div>

      </div>

      {/* Bottom copyright bar */}
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Thanmai Home Foods. All rights reserved.
      </div>
    </footer>
  );
}
