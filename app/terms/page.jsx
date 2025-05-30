'use client'

import React from 'react'
import Link from 'next/link'
import '../../styles/pages/Terms.css'
import { motion } from 'framer-motion'
import { fade } from '../lib/animationVariants'

export default function TermsPage() {
  return (
    <motion.div variants={fade} initial="hidden" animate="visible">
      <main className="terms-page">
        <h1>Terms &amp; Conditions</h1>
        <p>Welcome to Thanmai Home Foods. By using our website and placing an order, you agree to the following terms:</p>
        <ol>
          <li>
            <strong>Introduction</strong><br />
            These Terms and Conditions govern your use of our products and services. Please read them carefully before purchasing.
          </li>
          <li>
            <strong>Products</strong><br />
            We produce and sell traditional Telugu pickles made with natural ingredients. We reserve the right to modify or discontinue any product without prior notice. All products comply with local food-safety regulations.
          </li>
          <li>
            <strong>Orders &amp; Payment</strong><br />
            Orders can be placed via our website or by phone. Payment is due at the time of order unless otherwise agreed.
          </li>
          <li>
            <strong>Shipping &amp; Delivery</strong><br />
            We deliver across India. Delivery times vary by location. Orders are processed within 2–3 business days after payment confirmation. We are not responsible for delays caused by third-party carriers.
          </li>
          <li>
            <strong>Returns &amp; Refunds</strong><br />
            Due to the perishable nature of our products, all sales are final. If a product arrives damaged or spoiled, please contact us within 48 hours for a replacement or refund after investigation.
          </li>
          <li>
            <strong>Use of Website</strong><br />
            You may not use our site in any way that harms its operation or security. Unauthorized use may give rise to civil and/or criminal liability.
          </li>
          <li>
            <strong>Intellectual Property</strong><br />
            All branding, logos, and product names are the property of Thanmai Home Foods and may not be used without our permission.
          </li>
          <li>
            <strong>Privacy Policy</strong><br />
            We respect your privacy. For details on how we collect and use your data, please see our <Link href="/privacy">Privacy Policy</Link>.
          </li>
          <li>
            <strong>Governing Law</strong><br />
            These terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of the courts in Andhra Pradesh.
          </li>
          <li>
            <strong>Contact Information</strong><br />
            Thanmai Home Foods<br />
            Phone: +91-73373-79624<br />
            Email: <a href="mailto:thanmaifoods@gmail.com">thanmaifoods@gmail.com</a>
          </li>
        </ol>

        <div className="terms-back">
          <Link href="/">← Back to Home</Link>
        </div>
      </main>
    </motion.div>
  )
}
