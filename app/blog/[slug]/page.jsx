'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import blogPosts from '../../lib/blogMockData';
import '../../../styles/pages/BlogPost.css';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find(b => b.slug === slug);

  if (!post) return <p>Blog post not found.</p>;

  return (
    <>
      <Navbar />
      <main className="blog-post-page">
        <h1>{post.title}</h1>
        <img src={post.coverImage} alt={post.title} />
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </main>
      <Footer />
    </>
  );
}
