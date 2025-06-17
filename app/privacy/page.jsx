'use client'

import React from 'react'
import Link from 'next/link'
import '../../styles/pages/Privacy.css'

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <h1>Privacy Policy</h1>

      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to Thanmai Home Foods. Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and purchase our products.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <ul>
          <li><strong>Personal Data:</strong> Name, email, phone, shipping address when you place an order or register.</li>
          <li><strong>Payment Data:</strong> Billing information like card number, expiry, &amp; CVV processed by our payment gateway (we do not store full card details).</li>
          <li><strong>Usage Data:</strong> Pages visited, products viewed, IP address, browser type, and device information collected via cookies and analytics.</li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To process and fulfill your orders, send order confirmations and shipping updates.</li>
          <li>To improve our products, website experience, and customer service.</li>
          <li>To send you promotional emails, newsletters, and offers (you can unsubscribe any time).</li>
          <li>To comply with legal obligations and protect our rights.</li>
        </ul>
      </section>

      <section>
        <h2>4. Sharing Your Information</h2>
        <p>
          We may share your data with:
        </p>
        <ul>
          <li><strong>Service Providers:</strong> Shipping carriers, payment processors, and analytics vendors under strict confidentiality.</li>
          <li><strong>Legal Authorities:</strong> If required by law or to protect our rights.</li>
          <li><strong>With Your Consent:</strong> Other third parties when you explicitly authorize.</li>
        </ul>
      </section>

      <section>
        <h2>5. Cookies &amp; Tracking</h2>
        <p>
          We use cookies and similar technologies to remember your preferences, analyze site traffic, and personalize content. You can disable cookies in your browser, though this may affect functionality.
        </p>
      </section>

      <section>
        <h2>6. Data Security</h2>
        <p>
          We implement reasonable security measures to protect your information. However, no electronic system is completely secure—please help us by choosing a strong password and keeping it private.
        </p>
      </section>

      <section>
        <h2>7. Children’s Privacy</h2>
        <p>
          Our services are not intended for children under 18. We do not knowingly collect personal data from minors. If you believe we have—please contact us to have it removed.
        </p>
      </section>

      <section>
        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this policy periodically. The “Last updated” date at the top will reflect changes. Continued use of our site after updates constitutes acceptance of the new terms.
        </p>
      </section>

      <section>
        <h2>9. Contact Us</h2>
        <p>
          If you have questions or concerns about your privacy, please reach out at:<br/>
          Email: <a href="mailto:info@thanmaihomefoods.com">info@thanmaihomefoods.com</a><br/>
          Phone: <strong>+91-73373-79624</strong>
        </p>
      </section>

      <div className="privacy-back">
        <Link href="/">← Back to Home</Link>
      </div>
    </main>
  )
}
