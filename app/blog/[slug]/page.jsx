'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../lib/api';
import blogPosts from '../../lib/blogMockData';
import '../../../styles/pages/BlogPost.css';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get('/blog-posts')
      .then(res => {
        const found = res.data.find(b => b.slug === slug);
        setPost(found);
      })
      .catch(console.error);
  }, [slug]);

  if (!post) return <p>Loading…</p>;

  return (
    <>
     
      <main className="blog-post-page">
        <h1>{post.title}</h1>
        <img src={post.coverImage} alt={post.title} />
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </main>
     
    </>
  );
}
