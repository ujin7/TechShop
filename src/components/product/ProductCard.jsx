'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Heart, ShoppingCart, Star } from 'lucide-react';
import Badge from '../ui/Badge';
import ProductImageFallback from './ProductImageFallback';
import { formatPrice } from '@/utils/formatPrice';
import { useWishlist } from '@/hooks/useWishlist';
import styles from './ProductCard.module.css';

export default function ProductCard({
  product,
  onAddToCart = () => {},
  onAddToCompare = () => {},
  onNeedLogin = () => {},
}) {
  const { isWished, toggle } = useWishlist();

  if (!product) return null;

  const wished = isWished(product.id);

  const handleWishToggle = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const result = await toggle(product.id);
    if (result?.needLogin) onNeedLogin();
  };

  const handleCardMouseMove = (event) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();

    const px = ((event.clientX - rect.left) / rect.width) * 100;
    const py = ((event.clientY - rect.top) / rect.height) * 100;

    const offsetX = (event.clientX - rect.left - rect.width / 2) / rect.width;
    const offsetY = (event.clientY - rect.top - rect.height / 2) / rect.height;

    target.style.setProperty('--mx', `${px}%`);
    target.style.setProperty('--my', `${py}%`);
    target.style.setProperty('--rx', `${offsetX * 4}deg`);
    target.style.setProperty('--ry', `${offsetY * -4}deg`);
    target.style.setProperty('--ix', `${offsetX * 5}deg`);
    target.style.setProperty('--iy', `${offsetY * -5}deg`);
  };

  const handleCardMouseLeave = (event) => {
    const target = event.currentTarget;
    target.style.setProperty('--rx', '0deg');
    target.style.setProperty('--ry', '0deg');
    target.style.setProperty('--ix', '0deg');
    target.style.setProperty('--iy', '0deg');
  };

  return (
    <div className={styles.card} onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
      <Link href={`/products/${product.id}`} style={{ display: 'contents' }}>
        <div className={styles.imageArea}>
          <div className={styles.badges}>
            {product.isNew && <Badge variant="new">NEW</Badge>}
            {product.originalPrice && <Badge variant="sale">SALE</Badge>}
          </div>

          <div className={styles.categoryPill}>{product.brand}</div>

          <div className={styles.imageWrap}>
            <ProductImageFallback category={product.category} size={72} />
          </div>

          <div className={styles.specsOverlay}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>디스플레이</span>
              <span className={styles.specValue}>{product.specs?.display?.split(',')[0] || '-'}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>프로세서</span>
              <span className={styles.specValue}>{product.specs?.processor || '-'}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>배터리</span>
              <span className={styles.specValue}>{product.specs?.battery || '-'}</span>
            </div>
          </div>
        </div>
      </Link>

      <div className={styles.actionsHover}>
        <button
          className={styles.iconBtn}
          onClick={onAddToCart}
          aria-label="장바구니에 추가"
          title="장바구니에 추가"
        >
          <ShoppingCart size={18} />
        </button>
        <button
          className={`${styles.iconBtn} ${wished ? styles.wishedBtn : ''}`}
          onClick={handleWishToggle}
          aria-label={wished ? '찜 해제' : '찜하기'}
          title={wished ? '찜 해제' : '찜하기'}
        >
          <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
        </button>
        <button
          className={styles.iconBtn}
          onClick={onAddToCompare}
          aria-label="비교함에 추가"
          title="비교함에 추가"
        >
          <Activity size={18} />
        </button>
      </div>

      <Link href={`/products/${product.id}`} className={styles.info}>
        <div className={styles.metaRow}>
          <p className={styles.brand}>{product.brand}</p>
          <span className={styles.rating}>
            <Star size={12} fill="currentColor" />
            {product.rating ?? '-'}
          </span>
        </div>

        <h3 className={styles.name}>{product.name}</h3>

        <p className={styles.subInfo}>
          리뷰 {product.reviewCount?.toLocaleString?.() ?? 0}개
          {product.stock ? ` · 재고 ${product.stock}개` : ''}
        </p>

        <div className={styles.priceRow}>
          <div className={styles.priceGroup}>
            {product.originalPrice && (
              <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
            )}
            <span className={styles.price}>{formatPrice(product.price)}</span>
          </div>
          <span className={styles.ctaText}>자세히 보기</span>
        </div>
      </Link>
    </div>
  );
}
