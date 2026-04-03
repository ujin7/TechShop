'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Activity, Package } from 'lucide-react';
import { useProductDetail } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useCompare } from '@/hooks/useCompare';
import { formatPrice, calcDiscountRate } from '@/utils/formatPrice';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductImageFallback from '@/components/product/ProductImageFallback';
import ProductSpecTable from '@/components/product/ProductSpecTable';
import ProductReviewSection from '@/components/product/ProductReviewSection';
import StarRating from '@/components/product/StarRating';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { getCategoryBySlug } from '@/data/categories';
import styles from './page.module.css';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');

  const { product, related, reviews, reviewMeta, isLoading, addReviewOptimistic } = useProductDetail(productId);
  const { addToCart, openDrawer, isInCart } = useCart();
  const { addToCompare, isInCompare } = useCompare();

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
      openDrawer();
    }
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className="app-container">
          <div className={styles.productSection}>
            <Skeleton variant="rect" style={{ height: 480, borderRadius: 16 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Skeleton variant="text" style={{ width: '60%', height: 20 }} />
              <Skeleton variant="text" style={{ width: '90%', height: 36 }} />
              <Skeleton variant="text" style={{ width: '40%', height: 48 }} />
              <Skeleton variant="rect" style={{ height: 100 }} />
              <Skeleton variant="rect" style={{ height: 52 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.page}>
        <div className="app-container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <Package size={64} style={{ opacity: 0.3, marginBottom: 16 }} />
          <h2 style={{ color: 'var(--text-secondary)' }}>상품을 찾을 수 없습니다</h2>
          <Link href="/" style={{ color: 'var(--color-accent)', marginTop: 16, display: 'inline-block' }}>← 홈으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  const categoryData = getCategoryBySlug(product.category);
  const discountRate = calcDiscountRate(product.originalPrice, product.price);
  const alreadyInCart = isInCart(product.id);
  const alreadyInCompare = isInCompare(product.id);

  const breadcrumbs = [
    { label: '홈', href: '/' },
    { label: categoryData?.name || product.category, href: `/categories/${product.category}` },
    { label: product.name },
  ];

  return (
    <div className={styles.page}>
      <div className="app-container">
        <Breadcrumb items={breadcrumbs} />

        {/* 상품 메인 섹션 */}
        <div className={styles.productSection}>
          <ProductImageGallery category={product.category} productName={product.name} count={(product.images || []).length || 1} />

          <div className={styles.productInfo}>
            <p className={styles.brand}>{product.brand}</p>
            <h1 className={styles.name}>{product.name}</h1>

            <div className={styles.ratingRow}>
              <StarRating value={product.rating} size="sm" />
              <span className={styles.ratingNum}>{product.rating}</span>
              <span className={styles.reviewCount}>({reviewMeta.total}개 리뷰)</span>
            </div>

            <div className={styles.priceBlock}>
              {product.originalPrice && (
                <p className={styles.originalPrice}>{formatPrice(product.originalPrice)}</p>
              )}
              <div className={styles.priceRow}>
                <span className={styles.price}>{formatPrice(product.price)}</span>
                {discountRate > 0 && (
                  <span className={styles.discountBadge}>{discountRate}% OFF</span>
                )}
              </div>
              <p className={styles.shippingInfo}>
                {product.price >= 50000 ? '무료 배송' : '배송비 3,000원'}
              </p>
              <p className={`${styles.stockInfo} ${product.stock > 0 ? styles.inStock : styles.outOfStock}`}>
                {product.stock > 0 ? `재고 ${product.stock}개` : '품절'}
              </p>
            </div>

            {/* 수량 */}
            <div className={styles.qtyRow}>
              <span className={styles.qtyLabel}>수량</span>
              <div className={styles.qtyControls}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                >−</button>
                <span className={styles.qtyNum}>{qty}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  disabled={qty >= product.stock}
                >+</button>
              </div>
            </div>

            {/* CTA 버튼 */}
            <div className={styles.ctaButtons}>
              <Button
                variant="primary"
                size="lg"
                icon={ShoppingCart}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {alreadyInCart ? '장바구니에 있음' : '장바구니 담기'}
              </Button>
            </div>

            <button
              className={styles.compareBtn}
              onClick={() => addToCompare(product)}
              disabled={alreadyInCompare}
            >
              <Activity size={16} />
              {alreadyInCompare ? '비교함에 담겨있음' : '비교함에 추가'}
            </button>

            {/* 태그 */}
            {product.tags?.length > 0 && (
              <div className={styles.tags}>
                {product.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 탭 섹션 */}
        <div className={styles.tabsSection}>
          <div className={styles.tabs}>
            {[
              { key: 'specs', label: '스펙' },
              { key: 'description', label: '상세 설명' },
              { key: 'reviews', label: `리뷰 (${reviewMeta.total})` },
            ].map((t) => (
              <button
                key={t.key}
                className={`${styles.tab} ${activeTab === t.key ? styles.active : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'specs' && (
              <ProductSpecTable specs={product.specs} category={product.category} />
            )}
            {activeTab === 'description' && (
              <p className={styles.description}>{product.description}</p>
            )}
            {activeTab === 'reviews' && (
              <ProductReviewSection
                productId={product.id}
                reviews={reviews}
                reviewMeta={reviewMeta}
                onAddReview={addReviewOptimistic}
              />
            )}
          </div>
        </div>

        {/* 관련 상품 */}
        {related.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.sectionTitle}>관련 상품</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {related.slice(0, 4).map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    transition: 'var(--transition-normal)',
                  }}>
                    <div style={{ width: '100%', aspectRatio: '1' }}>
                      <ProductImageFallback category={p.category} size={56} />
                    </div>
                    <div style={{ padding: '12px' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-accent)', marginBottom: 4 }}>{p.brand}</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 8, fontWeight: 500 }}>{p.name}</p>
                      <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatPrice(p.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
