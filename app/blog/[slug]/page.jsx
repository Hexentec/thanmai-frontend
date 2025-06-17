'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import blogPosts from '../../lib/blogMockData';
import '../../../styles/pages/BlogPost.css';
import { motion } from 'framer-motion';
import { fade } from '../../lib/animationVariants';
import ImageWithFallback from '../../components/ImageWithFallback';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find(b => b.slug === slug);

  if (!post) return <p>Blog post not found.</p>;

  return (
    <motion.div variants={fade} initial="hidden" animate="visible">
      <main className="blog-post-page">
        <h1>{post.title}</h1>
        <ImageWithFallback src={post.coverImage} alt={post.title} nextImage={false} />
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </main>
    </motion.div>
  );
}
