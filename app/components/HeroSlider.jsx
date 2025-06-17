// app/components/HeroSlider.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ImageWithFallback from './ImageWithFallback';
import api from '../lib/api';
import '../../styles/components/HeroSlider.css';
import { motion } from 'framer-motion';
import { fade } from '../lib/animationVariants';

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    api.get('/slider')
       .then(res => setSlides(Array.isArray(res.data) ? res.data : []))
       .catch(() => setSlides([]));
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const dummy = '/assets/dummy1.png';

  // Build exactly two slots, falling back to the single dummy image
  const finalSlides = [0, 1].map(i => {
    const imgUrl = slides[i]?.image?.trim() || dummy;
    const key    = slides[i]?._id || `dummy-${i}`;
    return { key, src: imgUrl };
  });

  return (
    <motion.section className="hero-slider" variants={fade} initial="hidden" animate="visible" aria-label="Featured Pickles" role="region">
      {finalSlides.map(({ key, src }, i) => (
        <motion.div
          key={key}
          className="slide"
          role="group"
          aria-roledescription="slide"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 * i, duration: 0.6, ease: 'easeOut' }}
          whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(160,29,70,0.18)' }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Stretched blurred background image */}
          <ImageWithFallback
            src={src}
            alt="Background blur"
            fill
            className="slide-bg-blur"
            sizes="100vw"
            nextImage={true}
            style={{ objectFit: 'cover', filter: 'blur(32px) brightness(1.12)', zIndex: 0 }}
            aria-hidden="true"
            draggable={false}
          />
          {/* Main hero image */}
          <ImageWithFallback
            src={src}
            alt="Delicious homemade pickles"
            fill
            className={`slide-image${isMobile ? ' mobile' : ' desktop'}`}
            sizes="100vw"
            priority
            nextImage={true}
            style={{ objectFit: isMobile ? 'cover' : 'contain', width: '100%', height: '100%', zIndex: 1 }}
          />
          <div className="slide-overlay" aria-hidden="true"></div>
        </motion.div>
      ))}
    </motion.section>
  );
}
