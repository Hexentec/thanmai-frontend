'use client';

import React from 'react';
import '../../styles/components/WhyUs.css';

export default function WhyUs() {
  const items = [
    { icon: '/assets/icons/traditional.svg', title: 'Traditional Recipe', text: 'Handcrafted using time-tested recipes.' },
    { icon: '/assets/icons/small-batch.svg',  title: 'Small-Batch Quality', text: 'Freshly made in every order.' },
    { icon: '/assets/icons/pure.svg',         title: 'Pure Ingredients',    text: 'No preservatives, no compromise.' },
  ];

  return (
    <section className="why-us">
      {items.map((it, i) => (
        <div key={i} className="wu-item">
          <img src={it.icon} alt={it.title} className="wu-icon" />
          <h3>{it.title}</h3>
          <p>{it.text}</p>
        </div>
      ))}
    </section>
  );
}
