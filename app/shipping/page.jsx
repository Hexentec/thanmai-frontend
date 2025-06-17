'use client'

import React from 'react'
import Link from 'next/link'
import '../../styles/pages/Shipping.css'

export default function ShippingPage() {
  return (
    <main className="shipping-page">
      <h1>Shipping Policy</h1>

      <section>
        <h2>Shipping Locations</h2>
        <p>
          We currently ship our products across <strong>India</strong>.  
          We do not offer international shipping at this time.
        </p>
      </section>

      <section>
        <h2>Shipping Timeframes</h2>
        <ul>
          <li>Orders are processed within <strong>1–3 business days</strong> after payment confirmation.</li>
          <li>Once processed, delivery typically takes <strong>5–7 business days</strong>, depending on location.</li>
          <li>You will receive a confirmation email with a tracking number once your order is dispatched.</li>
        </ul>
      </section>

      <section>
        <h2>Shipping Charges</h2>
        <p>
          Shipping charges are calculated and displayed at checkout based on your delivery location and order weight.  
          Any promotional offers (free or discounted shipping) will be subject to the terms specified at the time of the offer.
        </p>
      </section>

      <section>
        <h2>Delays in Shipping</h2>
        <p>
          While we strive to meet our delivery timeframes, unforeseen events (natural disasters, strikes, carrier issues) may cause delays.  
          Thanmai Home Foods is not responsible for third-party carrier delays, but we will keep you updated and assist in tracking your order.
        </p>
      </section>

      <section>
        <h2>Order Cancellations</h2>
        <p>
          Orders can only be canceled before they are shipped. Once dispatched, orders cannot be canceled or modified.  
          To cancel, please contact us ASAP at <a href="mailto:info@thanmaihomefoods.com">info@thanmaihomefoods.com</a> or call <strong>+91-73373-79624</strong>.
        </p>

        <h3>Refunds for Canceled Orders</h3>
        <p>
          Successful cancellations will be refunded within <strong>7–10 business days</strong> via your original payment method.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>
          For questions or assistance, reach out at:<br />
          Email: <a href="mailto:info@thanmaihomefoods.com">info@thanmaihomefoods.com</a><br />
          Phone: <strong>+91-73373-79624</strong>
        </p>
      </section>

      <div className="shipping-back">
        <Link href="/">← Back to Home</Link>
      </div>
    </main>
  )
}
