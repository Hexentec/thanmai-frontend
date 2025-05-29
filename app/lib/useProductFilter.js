import { useMemo } from 'react';

export default function useProductFilter(products, filters, sortBy) {
  return useMemo(() => {
    let filtered = products;
    // Availability filter
    if (filters.inStock && !filters.outOfStock) {
      filtered = filtered.filter(p => (p.variants[0]?.stock ?? 1) > 0);
    } else if (!filters.inStock && filters.outOfStock) {
      filtered = filtered.filter(p => (p.variants[0]?.stock ?? 1) <= 0);
    }
    // Tag filter
    if (filters.tag) {
      filtered = filtered.filter(p => (p.tags || []).includes(filters.tag));
    }
    // Sorting
    if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => (a.variants[0]?.discountedPrice ?? a.variants[0]?.price ?? 0) - (b.variants[0]?.discountedPrice ?? b.variants[0]?.price ?? 0));
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => (b.variants[0]?.discountedPrice ?? b.variants[0]?.price ?? 0) - (a.variants[0]?.discountedPrice ?? a.variants[0]?.price ?? 0));
    }
    return filtered;
  }, [products, filters, sortBy]);
} 