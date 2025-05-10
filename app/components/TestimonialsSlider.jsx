'use client';

import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import '../../styles/components/TestimonialsSlider.css';

export default function TestimonialsSlider() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get('/testimonials')
      .then(res => setList(res.data))
      .catch(console.error);
  }, []);

  return (
    <section className="testimonials-slider">
      {list.map(t => (
        <div key={t._id} className="ts-card">
          <img src={t.authorPhoto} alt={t.authorName} className="ts-photo" />
          <blockquote>"{t.quote}"</blockquote>
          <p className="ts-author">— {t.authorName}</p>
        </div>
      ))}
    </section>
  );
}
