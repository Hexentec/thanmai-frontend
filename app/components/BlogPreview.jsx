import React from 'react';
import Link from 'next/link';
import blogPosts from '../lib/blogMockData';
import '../../styles/pages/BlogList.css';
import ImageWithFallback from './ImageWithFallback';

export default function BlogPreview() {
  // Show the latest 3 posts
  const posts = blogPosts.slice(0, 3);

  // Helper to get excerpt from HTML content
  function getExcerpt(html, wordCount = 20) {
    const text = html.replace(/<[^>]+>/g, '');
    const words = text.split(' ');
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(' ') + '...';
  }

  return (
    <section className="blog-preview-section">
      <h2 style={{ textAlign: 'center', color: '#A01d46', marginBottom: '1.5rem' }}>From Our Blog</h2>
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
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-excerpt">{getExcerpt(post.content)}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <Link href="/blog" style={{ color: '#A01d46', fontWeight: 'bold', fontSize: '1.1rem' }}>View all blog posts →</Link>
      </div>
    </section>
  );
} 