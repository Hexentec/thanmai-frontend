'use client';
import React from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import CategoriesGrid from './components/CategoriesGrid';
import FeaturedProducts from './components/FeaturedProducts';
import WhyUs from './components/WhyUs';
import TestimonialsSlider from './components/TestimonialsSlider';
import BulkRequestForm from './components/BulkRequestForm';
import Footer from './components/Footer';
import '../styles/pages/Home.css';

export default function HomePage() {
  return (
    <>
      
      <main className="home-page">
        <HeroSlider />
        <CategoriesGrid />
        <FeaturedProducts />
        <WhyUs />
        <TestimonialsSlider />
        <BulkRequestForm />
      </main>
      
    </>
  );
}
