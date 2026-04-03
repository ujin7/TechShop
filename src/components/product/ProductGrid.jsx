'use client';

import ProductCard from './ProductCard';
import Skeleton from '../ui/Skeleton';
import styles from './ProductGrid.module.css';

export default function ProductGrid({
  products = [], layout = 'grid', isLoading = false,
  onAddToCart = () => {}, onAddToCompare = () => {},
}) {
  if (isLoading) {
    return (
      <div className={`${styles.grid} ${layout === 'list' ? styles.listLayout : ''}`}>
        {Array.from({ length: 12 }, (_, i) => (
          <Skeleton key={i} variant="rect" style={{ height: 300, borderRadius: 16 }} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🔍</span>
        <p className={styles.emptyTitle}>검색 결과가 없습니다</p>
        <p className={styles.emptyDesc}>다른 검색어나 필터 조건을 사용해 보세요.</p>
      </div>
    );
  }

  return (
    <div className={`${styles.grid} ${layout === 'list' ? styles.listLayout : ''}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => onAddToCart(product)}
          onAddToCompare={() => onAddToCompare(product)}
        />
      ))}
    </div>
  );
}
