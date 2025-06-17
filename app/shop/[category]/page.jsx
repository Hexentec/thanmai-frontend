'use client';
// app/shop/[category]/page.jsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeprecatedCategoryPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/shop');
  }, [router]);
  return null;
}
