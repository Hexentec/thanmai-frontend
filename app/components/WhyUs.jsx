'use client';

import React from 'react';
import {
  FaHistory,
  FaBoxOpen,
  FaLeaf,
  FaTruck
} from 'react-icons/fa';
import '../../styles/components/WhyUs.css';

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
    <section className="why-us-section">
      <h2 className="wu-title">Why Thanmai Home Foods</h2>
      <div className="why-us">
        {items.map(({ Icon, title, text }, i) => (
          <div key={i} className="wu-item">
            <Icon className="wu-icon" />
            <h3 className="wu-item-title">{title}</h3>
            <p className="wu-item-text">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
