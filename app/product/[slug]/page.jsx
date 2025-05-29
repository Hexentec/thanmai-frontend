// app/product/[slug]/page.jsx
import React from 'react'
import ProductPage from './page.client'
import api         from '../../lib/api'


// 1️⃣ Pre-generate one page per product slug
function normalizeSlug(slug) {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function generateStaticParams() {
  const prods = await api.get('/products').then(r => r.data)
  return prods.map(p => ({ slug: normalizeSlug(p.slug) }))
}

export async function getProduct(slug) {
  const normalize = s => s.toLowerCase().replace(/[-_\s]+/g, '');
  const prods = await api.get('/products').then(r => r.data)
  return prods.find(p => normalize(p.slug) === normalize(slug)) || null;
}

// 2️⃣ Render client component, passing product as prop
export default async function PageWrapper({ params }) {
  const product = await getProduct(params.slug);
  return <ProductPage product={product} />;
}
