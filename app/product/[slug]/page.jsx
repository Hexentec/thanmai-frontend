// app/product/[slug]/page.jsx
import React from 'react'
import ProductPage from './page.client'
import api         from '../../lib/api'


// 1️⃣ Pre-generate one page per product slug
function normalizeSlug(slug) {
  // Use backend slug as-is, just trim whitespace
  return (slug || '').trim();
}

export async function generateStaticParams() {
  const prods = await api.get('/products').then(r => r.data)
  const normalize = s =>
    decodeURIComponent(s || '')
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  return prods.map(p => ({ slug: normalize(p.slug) }))
}

export async function getProduct(slug) {
  // Normalize: decode, replace all non-alphanumerics with spaces, collapse spaces, trim, lowercase
  const normalize = s =>
    decodeURIComponent(s || '')
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

  const prods = await api.get('/products').then(r => r.data);
  const inputSlug = normalize(slug);
  return prods.find(p => normalize(p.slug) === inputSlug) || null;
}

// 2️⃣ Render client component, passing product as prop
export default async function PageWrapper({ params }) {
  const product = await getProduct(params.slug);
  // Add fallback for missing/invalid product fields
  if (!product || !product.variants || product.variants.length === 0) {
    return <div style={{padding:'2rem',textAlign:'center'}}>Product not found or missing data.</div>;
  }
  // Only render the client component, do not use motion here
  return (
    <ProductPage product={product} />
  );
}
