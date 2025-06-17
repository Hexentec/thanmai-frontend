'use client';
import React from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import CategoriesGrid from './components/CategoriesGrid';
import FeaturedProducts from './components/FeaturedProducts';
import YouTubeGallery from './components/YouTubeGallery';
import BlogPreview from './components/BlogPreview';
import WhyUs from './components/WhyUs';
import TestimonialsSlider from './components/TestimonialsSlider';
import BulkRequestForm from './components/BulkRequestForm';
import Footer from './components/Footer';
import '../styles/pages/Home.css';
import { motion } from 'framer-motion';
import { fade } from './lib/animationVariants';

export default function HomePage() {
  return (
    <motion.div variants={fade} initial="hidden" animate="visible">
      <main className="home-page">
        <HeroSlider />
        <CategoriesGrid />
        <FeaturedProducts />
        <YouTubeGallery />
        <BlogPreview />
        <WhyUs />
        <TestimonialsSlider />
        <BulkRequestForm />
      </main>
    </motion.div>
  );
}
