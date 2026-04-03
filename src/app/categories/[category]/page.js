'use client';

import { Suspense, useCallback, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUrlFilter } from '@/hooks/useUrlFilter';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useCompare } from '@/hooks/useCompare';
import { getCategoryBySlug } from '@/data/categories';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilter from '@/components/product/ProductFilter';
import ProductSort from '@/components/product/ProductSort';
import Pagination from '@/components/ui/Pagination';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';
import styles from './page.module.css';

function CategoryContent() {
  const params = useParams();
  const category = params.category;

  const [layout, setLayout] = useState('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { filters, setFilter, toggleBrand, resetFilters, toApiQuery, hasActiveFilters } = useUrlFilter();
  const { addToCart, openDrawer } = useCart();
  const { addToCompare } = useCompare();

  const query = toApiQuery({ category, limit: 12 });
  const { data: products, total, totalPages, meta, isLoading } = useProducts(query);

  const categoryData = getCategoryBySlug(category);

  const breadcrumbs = [
    { label: '홈', href: '/' },
    { label: categoryData?.name || category },
  ];

  const handleAddToCart = useCallback((product) => {
    addToCart(product);
    openDrawer();
  }, [addToCart, openDrawer]);

  return (
    <div className={styles.page}>
      <div className="app-container">
        <Breadcrumb items={breadcrumbs} />

        <div className={styles.header}>
          <h1 className={styles.title}>{categoryData?.name || category}</h1>
          {categoryData?.description && (
            <p className={styles.description}>{categoryData.description}</p>
          )}
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <ProductFilter
              filters={filters}
              setFilter={setFilter}
              toggleBrand={toggleBrand}
              resetFilters={resetFilters}
              hasActiveFilters={hasActiveFilters}
              availableBrands={meta?.brands || []}
              priceRange={meta?.priceRange || [0, 10000000]}
              isMobileOpen={isMobileFilterOpen}
              onMobileClose={() => setIsMobileFilterOpen(false)}
            />
          </aside>

          <main className={styles.main}>
            <ProductSort
              sortOption={filters.sort}
              onSortChange={(v) => setFilter('sort', v)}
              totalCount={total}
              layout={layout}
              onLayoutChange={setLayout}
              onMobileFilterOpen={() => setIsMobileFilterOpen(true)}
            />

            <ProductGrid
              products={products}
              layout={layout}
              isLoading={isLoading}
              total={total}
              onAddToCart={handleAddToCart}
              onAddToCompare={addToCompare}
            />

            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={(p) => setFilter('page', p)}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

function FallbackLoading() {
  return (
    <div style={{ minHeight: '100vh', padding: '32px 0' }}>
      <div className="app-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20, marginTop: 40 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} variant="rect" style={{ height: 320, borderRadius: 16 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<FallbackLoading />}>
      <CategoryContent />
    </Suspense>
  );
}
