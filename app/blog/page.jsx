'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '../../styles/pages/BlogList.css';
import blogPosts from '../lib/blogMockData';
import api from '../lib/api';
import ImageWithFallback from '../components/ImageWithFallback';
import { motion } from 'framer-motion';
import { fade } from '../lib/animationVariants';

export default function BlogListPage() {
  // Always use mock data
  const posts = blogPosts;

  // Helper to get excerpt from HTML content
  function getExcerpt(html, wordCount = 30) {
    const text = html.replace(/<[^>]+>/g, '');
    const words = text.split(' ');
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(' ') + '...';
  }

  return (
    <motion.div variants={fade} initial="hidden" animate="visible">
      <main className="blog-list-page">
        <h1>Blog</h1>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', margin: '2rem 0' }}>No blog posts found.</p>
        ) : (
          <ul className="blog-list blog-list-grid">
            {posts.map(post => (
              <li key={post._id} className="blog-list-item blog-card">
                <Link
                  href={`/blog/${post.slug}`}
                  aria-label={`Read blog post: ${post.title}`}
                  style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="blog-list-cover">
                    <ImageWithFallback src={post.coverImage} alt={post.title} nextImage={false} />
                  </div>
                  <h2 className="blog-title">{post.title}</h2>
                  <p className="blog-excerpt">{getExcerpt(post.content)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </motion.div>
  );
}
