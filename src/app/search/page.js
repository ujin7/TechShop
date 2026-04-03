'use client';

import { Suspense } from 'react';
import { useCart } from '@/hooks/useCart';
import { useUrlFilter } from '@/hooks/useUrlFilter';
import { useProducts } from '@/hooks/useProducts';
import ProductGrid from '@/components/product/ProductGrid';
import ProductSort from '@/components/product/ProductSort';
import Pagination from '@/components/ui/Pagination';
import styles from './search.module.css';

function SearchContent() {
  const { addToCart, openDrawer } = useCart();
  const { filters, setFilter, toApiQuery } = useUrlFilter();
  const query = toApiQuery();
  const { data: products, total, totalPages, isLoading } = useProducts(query);

  const handleAddToCart = (product) => {
    addToCart(product);
    openDrawer();
  };

  return (
    <div className="app-container">
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {filters.q ? `"${filters.q}" 검색 결과` : '전체 상품'}
          </h1>
          {!isLoading && (
            <p className={styles.count}>{total.toLocaleString()}개 상품</p>
          )}
        </div>
        <ProductSort
          sort={filters.sort}
          onChange={(v) => setFilter('sort', v)}
        />
      </div>

      <ProductGrid
        products={products}
        isLoading={isLoading}
        onAddToCart={handleAddToCart}
      />

      {totalPages > 1 && (
        <Pagination
          current={filters.page}
          total={totalPages}
          onChange={(p) => setFilter('page', p)}
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="app-container" style={{ paddingTop: 40, color: 'var(--text-tertiary)' }}>
        검색 중...
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
