'use client'

import React from 'react'
import Link from 'next/link'
import '../../styles/pages/Refund.css'
import { motion } from 'framer-motion'
import { fade } from '../lib/animationVariants'

export default function RefundPage() {
  return (
    <motion.div variants={fade} initial="hidden" animate="visible">
      <main className="refund-page">
        <h1>Refund & Returns Policy</h1>

        <section>
          <h2>1. Refund and Return Policy</h2>

          <h3>1.1 Perishable Nature of Products</h3>
          <p>
            Due to the perishable nature of our pickles, we do not accept returns or exchanges once products have shipped or been delivered.  
            However, if you receive a <strong>damaged</strong> or <strong>incorrect</strong> item, we&apos;re here to help.
          </p>

          <h3>1.2 Damaged or Incorrect Items</h3>
          <p>
            Contact us within <strong>48 hours</strong> of delivery:
          </p>
          <ul>
            <li>Email: <a href="mailto:info@thanmaihomefoods.com">info@thanmaihomefoods.com</a></li>
            <li>Include your order number, photos of the issue, and a brief description.</li>
          </ul>
          <p>
            Once verified, we&apos;ll offer a replacement or refund, per your preference.
          </p>

          <h3>1.3 Refund Process</h3>
          <p>
            Approved refunds are issued to your original payment method within <strong>7–10 business days</strong>.
          </p>

          <h3>1.4 Non-Refundable Situations</h3>
          <ul>
            <li>Products opened or tampered with after delivery</li>
            <li>Items not reported within 48 hours of delivery</li>
            <li>Requests based on taste preference</li>
          </ul>
        </section>

        <section>
          <h2>2. Shipping Policy</h2>
          <p>
            <strong>We ship across India only.</strong>  
            Orders are processed in 1–3 business days, then delivered in 5–7 business days.  
            Shipping charges are calculated at checkout. For full details, see our <Link href="/shipping">Shipping Policy</Link>.
          </p>
        </section>

        <section>
          <h2>3. Order Cancellation</h2>

          <h3>3.1 Cancel Before Shipping</h3>
          <p>
            You may cancel before dispatch by contacting us at <a href="mailto:info@thanmaihomefoods.com">info@thanmaihomefoods.com</a> or <strong>+91-73373-79624</strong>.
          </p>

          <h3>3.2 Refunds for Cancellations</h3>
          <p>
            Successful cancellations are refunded within <strong>7–10 business days</strong> via your original payment method.
          </p>
        </section>

        <section>
          <h2>4. Contact Us</h2>
          <p>
            Questions? We&apos;re here to help:<br />
            Email: <a href="mailto:info@thanmaihomefoods.com">info@thanmaihomefoods.com</a><br />
            Phone: <strong>+91-73373-79624</strong>
          </p>
        </section>

        <div className="refund-back">
          <Link href="/">← Back to Home</Link>
        </div>
      </main>
    </motion.div>
  )
}
