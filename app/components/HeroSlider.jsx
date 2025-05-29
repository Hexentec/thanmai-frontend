// app/components/HeroSlider.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ImageWithFallback from './ImageWithFallback';
import api from '../lib/api';
import '../../styles/components/HeroSlider.css';

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    api.get('/slider')
       .then(res => setSlides(Array.isArray(res.data) ? res.data : []))
       .catch(() => setSlides([]));
  }, []);

  const dummy = '/assets/dummy1.png';

  // Build exactly two slots, falling back to the single dummy image
  const finalSlides = [0, 1].map(i => {
    const imgUrl = slides[i]?.image?.trim() || dummy;
    const key    = slides[i]?._id || `dummy-${i}`;
    return { key, src: imgUrl };
  });

  return (
    <section className="hero-slider" aria-label="Featured Pickles" role="region">
      {finalSlides.map(({ key, src }) => (
        <div key={key} className="slide" role="group" aria-roledescription="slide">
          <ImageWithFallback
            src={src}
            alt="Delicious homemade pickles"
            fill
            className="slide-image"
            sizes="100vw"
            priority
            nextImage={true}
          />
          {/* Optionally add overlay for future text/buttons */}
          {/* <div className="slide-overlay">Your text or CTA here</div> */}
        </div>
      ))}
    </section>
  );
}
