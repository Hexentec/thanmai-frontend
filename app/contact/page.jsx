'use client';
import React, { useState } from 'react';

import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiFacebook,
  FiInstagram,
  FiTwitter
} from 'react-icons/fi';
import '../../styles/pages/Contact.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const onChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: wire up your API
      alert('Message sent!');
      setForm({ name: '', email: '', message: '' });
    } catch {
      alert('Error sending message');
    }
    setLoading(false);
  };

  return (
    <>
      

      <main className="contact-page" aria-label="Contact Thanmai Home Foods" role="main">
        <h1 className="contact-title">Get in Touch</h1>

        <div className="contact-container">
          {/* —— Form Card —— */}
          <section className="contact-card form-card" aria-label="Contact Form" role="region">
            <h2>Send us a message</h2>
            <form onSubmit={onSubmit} aria-label="Contact form">
              <label>
                Name
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Your full name"
                  required
                  aria-label="Name"
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="you@example.com"
                  required
                  aria-label="Email"
                />
              </label>
              <label>
                Message
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={onChange}
                  placeholder="How can we help you?"
                  required
                  aria-label="Message"
                />
              </label>
              <button type="submit" disabled={loading} aria-label="Send message">
                {loading ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </section>

          {/* —— Info + Map Card —— */}
          <section className="contact-card info-card" aria-label="Contact Information" role="region">
            <h2>Contact Information</h2>
            <div className="info-list">
              <div className="info-item">
                <FiMapPin className="info-icon" aria-hidden="true" />
                <span>Thanmai Home Foods
Door No: 1-16 Sangayagudem Post, DEVARAPALLE Mandal, East Godavari District, Andhra Pradesh, Pincode - 534313</span>
              </div>
              <div className="info-item">
                <FiPhone className="info-icon" aria-hidden="true" />
                <a href="tel:+917989687713" aria-label="Call support">+91-7989687713</a>
              </div>
              <div className="info-item">
                <FiMail className="info-icon" aria-hidden="true" />
                <a href="mailto:support@thanmaihomefoods.com" aria-label="Email support">
                  support@thanmaihomefoods.com
                </a>
              </div>
            </div>

            {/*  <h2>Follow Us</h2>
            <div className="social-list">
              <a href="#" aria-label="Facebook">
                <FiFacebook aria-hidden="true" />
              </a>
              <a href="#" aria-label="Instagram">
                <FiInstagram aria-hidden="true" />
              </a>
              <a href="#" aria-label="Twitter">
                <FiTwitter aria-hidden="true" />
              </a>
            </div> */}

            <h2>Our Location</h2>
            <div className="map-wrapper">
              <iframe
                title="Rajahmundry Location"
                src="https://maps.google.com/maps?q=Rajahmundry%20India&z=14&output=embed"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </section>
        </div>
      </main>

      
    </>
  );
}
