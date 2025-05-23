'use client';

import React, { useState, useEffect } from 'react';

import WhyUs       from '../components/WhyUs';
import Image       from 'next/image';
import api         from '../lib/api';
import '../../styles/pages/About.css';

export default function AboutPage() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get('/testimonials')
      .then(res => setTestimonials(res.data))
      .catch(console.error);
  }, []);

  return (
    <>
      

      <main className="about-page">
        {/* About Us */}
        <section className="about-section">
          <h2>About Us</h2>
          <p>
            Thanmai Home Foods began with a single family recipe and a passion for
            preserving the authentic taste of home-made pickles.  We handcraft each
            jar in small batches, using only the freshest ingredients, so that every
            bite transports you back to the warmth of a home-cooked meal.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="mv-section">
          <div className="mv-item">
            <h3>Our Mission</h3>
            <p>
              To bring the rich, vibrant flavors of traditional pickling into every
              modern kitchen—without preservatives, without compromise.
            </p>
          </div>
          <div className="mv-item">
            <h3>Our Vision</h3>
            <p>
              To be India’s most trusted name in artisanal pickles, recognized for
              quality, authenticity, and a taste that feels like home.
            </p>
          </div>
        </section>

        {/* Why Thanmai Home Foods */}
        <section className="why-section">
          
          <WhyUs />
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <h2>What Our Customers Say</h2>
          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t._id} className="testimonial-card">
                {t.authorPhoto && (
                  <Image
                    src={t.authorPhoto}
                    alt={t.authorName}
                    width={60}
                    height={60}
                    className="tc-avatar"
                  />
                )}
                <div className="tc-body">
                  <p className="tc-quote">“{t.quote}”</p>
                  <p className="tc-author">— {t.authorName}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

     
    </>
  );
}
