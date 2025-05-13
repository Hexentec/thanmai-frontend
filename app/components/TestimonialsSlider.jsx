'use client';

import React, { useState, useEffect, useRef } from 'react';
import api from '../lib/api';
import { AiFillStar } from 'react-icons/ai';
import '../../styles/components/TestimonialsSlider.css';

export default function TestimonialsSlider() {
  const [list, setList] = useState([]);
  const [index, setIndex] = useState(0);
  const sliderRef = useRef(null);

  const dummy = [
    {
      _id: 'dum1',
      authorName: 'Asha Reddy',
      quote: 'Absolutely love these pickles—so fresh and bursting with flavor!',
      rating: 5
    },
    {
      _id: 'dum2',
      authorName: 'Vikram Singh',
      quote: 'The best homemade taste I’ve had in years. Highly recommend!',
      rating: 5
    },
    {
      _id: 'dum3',
      authorName: 'Meera Patel',
      quote: 'Fantastic quality and service. My family can’t get enough.',
      rating: 5
    },
    {
      _id: 'dum4',
      authorName: 'Rahul Verma',
      quote: 'Superb packaging and prompt delivery. Great taste!',
      rating: 5
    },
    {
      _id: 'dum5',
      authorName: 'Meera Patel',
      quote: 'Fantastic quality and service. My family can’t get enough.',
      rating: 5
    },
    {
      _id: 'dum6',
      authorName: 'Rahul Verma',
      quote: 'Superb packaging and prompt delivery. Great taste!',
      rating: 5
    }
  ];

  useEffect(() => {
    api.get('/testimonials')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setList(res.data);
        } else {
          setList(dummy);
        }
      })
      .catch(() => {
        setList(dummy);
      });
  }, []);

  // autoplay
  useEffect(() => {
    if (list.length <= 2) return; 
    const maxIndex = list.length - 2;
    const timer = setInterval(() => {
      setIndex(i => (i < maxIndex ? i + 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, [list]);

  const maxIndex = Math.max(0, list.length - 2);

  const prev = () => setIndex(i => Math.max(i - 1, 0));
  const next = () => setIndex(i => Math.min(i + 1, maxIndex));

  return (
    <section className="ts-section">
      <h2 className="ts-title">What Our Customers Say</h2>

      <div className="ts-slider-wrapper">
        <div
          className="ts-slider"
          ref={sliderRef}
          style={{ transform: `translateX(-${index * 50}%)` }}
        >
          {list.map(t => (
            <div key={t._id} className="ts-card">
              <blockquote className="ts-quote">“{t.quote}”</blockquote>
              <div className="ts-stars">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <AiFillStar key={i} size={18} color="#f5a623" />
                ))}
              </div>
              <p className="ts-author">— {t.authorName}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="ts-controls">
        <button
          className="ts-arrow"
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          className="ts-arrow"
          onClick={next}
          disabled={index === maxIndex}
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </section>
  );
}
