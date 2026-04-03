'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Flame } from 'lucide-react';
import ProductCard from '../product/ProductCard';
import styles from './TrendingProducts.module.css';

/**
 * @param {object} props
 * @param {Array} props.products - 데이터 배열 (Claude Code가 주입)
 * @param {string} props.title - 헤딩 타이틀
 * @param {string} props.viewAllHref - 전체보기 링크
 * @param {function} props.onAddToCart - 장바구니 추가 콜백 
 * @param {function} props.onAddToCompare - 비교 추가 콜백 
 */
export default function TrendingProducts({ 
  products = [], 
  title = 'Trending Deals', 
  viewAllHref = '/categories',
  onAddToCart,
  onAddToCompare
}) {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.section}>
      <div className={`app-container`}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>
              <Flame className={styles.titleIcon} size={28} />
              {title}
            </h2>
            <p className={styles.subtitle}>2026년 가장 주목받는 최첨단 IT 기기를 확인하세요.</p>
          </div>

          <div className={styles.controls}>
            <Link href={viewAllHref} className={styles.viewAll}>
              View All <ChevronRight size={16} />
            </Link>
            
            <div className={styles.arrows}>
              <button 
                className={styles.arrowBtn} 
                onClick={scrollLeft}
                aria-label="이전 상품 보기"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                className={styles.arrowBtn} 
                onClick={scrollRight}
                aria-label="다음 상품 보기"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* 제품 캐러셀 영역 */}
        <div className={styles.carousel} ref={scrollRef}>
          {products.length > 0 ? (
             products.map(product => (
               <div key={product.id} className={styles.cardWrapper}>
                 <ProductCard 
                   product={product} 
                   onAddToCart={() => onAddToCart && onAddToCart(product)}
                   onAddToCompare={() => onAddToCompare && onAddToCompare(product)}
                 />
               </div>
             ))
          ) : (
            // 데이터가 내려오기 전 빈 상태 플레이스홀더 렌더링
            Array.from({ length: 4 }).map((_, i) => (
               <div key={`skeleton-${i}`} className={styles.cardWrapper}>
                  <div style={{ height: '380px', background: 'var(--glass-bg)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                     Loading Card...
                  </div>
               </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
