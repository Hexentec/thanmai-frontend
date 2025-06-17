'use client';

import React from 'react';
import {
  FaHistory,
  FaBoxOpen,
  FaLeaf,
  FaTruck
} from 'react-icons/fa';
import '../../styles/components/WhyUs.css';
import { motion } from 'framer-motion';
import { fade, slideUp } from '../lib/animationVariants';

export default function WhyUs() {
  const items = [
    {
      Icon: FaHistory,
      title: 'Traditional Recipe',
      text: 'Handcrafted using time-tested family recipes.'
    },
    {
      Icon: FaBoxOpen,
      title: 'Small-Batch Quality',
      text: 'Every jar is made fresh in small batches.'
    },
    {
      Icon: FaLeaf,
      title: 'Pure Ingredients',
      text: 'Only the finest, preservative-free ingredients.'
    },
    {
      Icon: FaTruck,
      title: 'Fast Delivery',
      text: 'Delivered swiftly to your doorstep.'
    }
  ];

  return (
    <motion.section className="why-us-section" variants={fade} initial="hidden" animate="visible">
      <h2 className="wu-title">Why Thanmai Home Foods</h2>
      <div className="why-us" role="list">
        {items.map(({ Icon, title, text }, i) => (
          <motion.div
            key={i}
            className="wu-item"
            role="listitem"
            aria-label={title}
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ scale: 1.06, boxShadow: '0 8px 32px rgba(160,29,70,0.13)' }}
            whileTap={{ scale: 0.97 }}
          >
            <Icon className="wu-icon" aria-hidden="true" />
            <h3 className="wu-item-title">{title}</h3>
            <p className="wu-item-text">{text}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
