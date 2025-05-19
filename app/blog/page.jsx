'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/api';
import Link from 'next/link';
import '../../styles/pages/BlogList.css';

export default function BlogListPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/blog-posts')
      .then(res => setPosts(res.data))
      .catch(console.error);
  }, []);

  return (
    <>
      
      <main className="blog-list-page">
        <h1>Blog</h1>
        <ul className="blog-list">
          {posts.map(post => (
            <li key={post._id}>
              <Link href={`/blog/${post.slug}`}>
                <a>{post.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      
    </>
  );
}
