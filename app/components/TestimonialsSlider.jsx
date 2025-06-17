// src/components/TestimonialsSlider.jsx
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import api from '../lib/api';
import { AiFillStar } from 'react-icons/ai';
import '../../styles/components/TestimonialsSlider.css';
import { motion, AnimatePresence } from 'framer-motion';
import { fade, slideUp } from '../lib/animationVariants';

export default function TestimonialsSlider() {
  const [list, setList]       = useState([]);
  const [index, setIndex]     = useState(0);
  const [perView, setPerView] = useState(2);
  const sliderRef             = useRef(null);

  const dummy = useMemo(() => [
    { _id:'dum1', authorName:'Asha Reddy', quote:'Absolutely love these pickles—so fresh and bursting with flavor!', rating:5 },
    { _id:'dum2', authorName:'Vikram Singh', quote:'The best homemade taste I\'ve had in years. Highly recommend!', rating:5 },
    { _id:'dum3', authorName:'Meera Patel', quote:'Fantastic quality and service. My family can\'t get enough.', rating:5 },
    { _id:'dum4', authorName:'Rahul Verma', quote:'Superb packaging and prompt delivery. Great taste!', rating:5 },
    { _id:'dum5', authorName:'Meera Patel', quote:'Fantastic quality and service. My family can\'t get enough.', rating:5 },
    { _id:'dum6', authorName:'Rahul Verma', quote:'Superb packaging and prompt delivery. Great taste!', rating:5 }
  ], []);

  // fetch or fallback
  useEffect(() => {
    api.get('/testimonials')
      .then(res => setList(res.data.length>0 ? res.data : dummy))
      .catch(() => setList(dummy));
  }, [dummy]);

  // recalc perView on resize
  useEffect(() => {
    const update = () => setPerView(window.innerWidth < 768 ? 1 : 2);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // autoplay
  useEffect(() => {
    if (list.length <= perView) return;
    const maxIdx = list.length - perView;
    const t = setInterval(() => {
      setIndex(i => (i < maxIdx ? i + 1 : 0));
    }, 5000);
    return () => clearInterval(t);
  }, [list, perView]);

  const maxIndex = Math.max(0, list.length - perView);
  const prev = () => setIndex(i => Math.max(i-1, 0));
  const next = () => setIndex(i => Math.min(i+1, maxIndex));

  // percentage shift
  const shift = index * (100 / perView);

  return (
    <motion.section className="testimonials-slider" variants={fade} initial="hidden" animate="visible">
      <h2 className="ts-title">What Our Customers Say</h2>

      <div className="ts-slider-wrapper">
        <div
          className="ts-slider"
          ref={sliderRef}
          style={{ transform: `translateX(-${shift}%)` }}
          role="list"
        >
          <AnimatePresence initial={false}>
            {list.map((t, i) => (
              <motion.div
                key={t._id}
                className="ts-card"
                role="listitem"
                aria-label={t.authorName}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: 0.1 * i, duration: 0.5, ease: 'easeOut' }}
                whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(160,29,70,0.18)' }}
                whileTap={{ scale: 0.97 }}
                variants={slideUp}
                viewport={{ once: true, amount: 0.2 }}
              >
                <blockquote className="ts-quote">“{t.quote}”</blockquote>
                <div className="ts-stars" aria-label={`Rated ${t.rating || 5} out of 5`}>
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <AiFillStar key={i} size={18} color="#f5a623" aria-hidden="true" />
                  ))}
                </div>
                <p className="ts-author">— {t.authorName}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="ts-controls">
        <motion.button className="ts-arrow" onClick={prev} disabled={index===0} aria-label="Previous testimonials" whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}>
          ‹
        </motion.button>
        <motion.button className="ts-arrow" onClick={next} disabled={index===maxIndex} aria-label="Next testimonials" whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}>
          ›
        </motion.button>
      </div>
    </motion.section>
  );
}
