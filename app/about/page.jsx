'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fade } from '../lib/animationVariants';

import WhyUs       from '../components/WhyUs';
import Image       from 'next/image';
import ImageWithFallback from '../components/ImageWithFallback';
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
    <motion.div variants={fade} initial="hidden" animate="visible">
      <main className="about-page" aria-label="About Thanmai Home Foods" role="main">
        {/* About Us */}
        <section className="about-section" aria-label="About Us" role="region">
          <h1>About Us</h1>
          <p>
            Thanmai Home Foods began with a single family recipe and a passion for
            preserving the authentic taste of home-made pickles.  We handcraft each
            jar in small batches, using only the freshest ingredients, so that every
            bite transports you back to the warmth of a home-cooked meal.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="mv-section" aria-label="Mission and Vision" role="region">
          <div className="mv-item">
            <h2>Our Mission</h2>
            <p>
              To bring the rich, vibrant flavors of traditional pickling into every
              modern kitchen—without preservatives, without compromise.
            </p>
          </div>
          <div className="mv-item">
            <h2>Our Vision</h2>
            <p>
              To be India&apos;s most trusted name in artisanal pickles, recognized for
              quality, authenticity, and a taste that feels like home.
            </p>
          </div>
        </section>

        {/* Why Thanmai Home Foods */}
        <section className="why-section" aria-label="Why Choose Us" role="region">
          <WhyUs />
        </section>

        {/* Testimonials */}
        <section className="testimonials-section" aria-label="Customer Testimonials" role="region">
          <h2>What Our Customers Say</h2>
          <div className="testimonials-grid" role="list">
            {testimonials.map(t => (
              <div key={t._id} className="testimonial-card" role="listitem" aria-label={t.authorName}>
                {t.authorPhoto && (
                  <ImageWithFallback
                    src={t.authorPhoto}
                    alt={t.authorName}
                    width={60}
                    height={60}
                    className="tc-avatar"
                    priority
                    nextImage={true}
                  />
                )}
                <div className="tc-body">
                  <p className="tc-quote">&ldquo;{t.quote}&rdquo;</p>
                  <p className="tc-author">&mdash; {t.authorName}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );
}
