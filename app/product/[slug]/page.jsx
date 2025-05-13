// app/product/[slug]/page.jsx
import React from 'react'
import ProductPage from './page.client'
import api         from '../../lib/api'

// 1️⃣ Pre-generate one page per product slug
export async function generateStaticParams() {
  const prods = await api.get('/products').then(r => r.data)
  return prods.map(p => ({ slug: p.slug }))
}

// 2️⃣ Simply render your existing client component,
//    passing it the slug so it can fetch & display itself.
export default function PageWrapper({ params }) {
  return <ProductPage slug={params.slug} />
}
