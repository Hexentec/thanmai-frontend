// app/components/HeroSlider.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
    <section className="hero-slider">
      {finalSlides.map(({ key, src }) => (
        <div key={key} className="slide">
          <Image
            src={src}
            alt=""
            fill
            className="slide-image"
            sizes="100vw"
          />
        </div>
      ))}
    </section>
  );
}
