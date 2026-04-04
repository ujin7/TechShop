'use client';

import Link from 'next/link';
import { ArrowRight, Star, Zap } from 'lucide-react';
import ProductImageFallback from '../product/ProductImageFallback';
import { formatPrice } from '@/utils/formatPrice';
import { useInView } from '@/hooks/useInView';
import styles from './FeaturedProducts.module.css';

function ProductCard({ product, large = false }) {
  const specEntry = product.specs
    ? Object.entries(product.specs).find(([k]) => ['processor', 'display', 'driver'].includes(k))
    : null;

  return (
    <Link
      href={`/products/${product.id}`}
      className={`${styles.card} ${large ? styles.cardLarge : styles.cardSmall}`}
    >
      <div className={styles.cardImage}>
        {product.isNew && <span className={styles.newBadge}>NEW</span>}
        {product.originalPrice && (
          <span className={styles.saleBadge}>
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
        <ProductImageFallback
          src={product.thumbnail}
          alt={product.name}
          category={product.category}
          size={large ? 96 : 56}
        />
      </div>

      <div className={`${styles.cardBody} ${large ? '' : styles.cardBodySmall}`}>
        <span className={styles.brand}>{product.brand}</span>
        <h3 className={styles.name}>{product.name}</h3>

        {specEntry && (
          <p className={styles.spec}>{specEntry[1].split(',')[0]}</p>
        )}

        <div className={styles.meta}>
          {product.rating > 0 && (
            <span className={styles.rating}>
              <Star size={12} fill="currentColor" />
              {product.rating}
            </span>
          )}
          {product.reviewCount > 0 && (
            <span className={styles.reviewCount}>({product.reviewCount.toLocaleString()})</span>
          )}
        </div>

        <div className={styles.priceRow}>
          <div className={styles.prices}>
            {product.originalPrice && (
              <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
            )}
            <span className={styles.price}>{formatPrice(product.price)}</span>
          </div>
          <span className={styles.cta}>
            자세히 <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedProducts({ products = [] }) {
  const [ref, inView] = useInView();

  if (!products.length) return null;

  const [first, ...rest] = products;

  return (
    <section ref={ref} className={`${styles.section} ${inView ? styles.visible : ''}`}>
      <div className="app-container">
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              <Zap size={13} />
              이달의 주목 상품
            </p>
            <h2 className={styles.title}>지금 가장 핫한 제품</h2>
          </div>
          <Link href="/categories" className={styles.viewAll}>
            전체 보기 <ArrowRight size={15} />
          </Link>
        </div>

        <div className={styles.grid}>
          <div className={`${styles.gridItem} ${styles.gridItemLarge}`}>
            <ProductCard product={first} large />
          </div>
          <div className={styles.gridRight}>
            {rest.slice(0, 2).map((p) => (
              <div key={p.id} className={styles.gridItem}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
