'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import ProductImageFallback from '../product/ProductImageFallback';
import styles from './Hero.module.css';

export default function Hero({ featuredProducts = [] }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mainProduct = featuredProducts[0];

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className={styles.hero}>
      <div
        className={styles.bgGlow1}
        style={{ transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)` }}
      />
      <div
        className={styles.bgGlow2}
        style={{ transform: `translate(${mousePos.x * -60}px, ${mousePos.y * -60}px)` }}
      />

      <div className={`app-container ${styles.container}`}>
        <div className={styles.content}>
          <div className={`${styles.badge} animate-fadeInDown`}>NEXT GEN 2026 RELEASES</div>

          <h1 className={`${styles.title} animate-fadeInUp`} style={{ animationDelay: '0.1s' }}>
            Elevate Your <br />
            <span>Digital Experience</span>
          </h1>

          <p className={`${styles.description} animate-fadeInUp`} style={{ animationDelay: '0.2s' }}>
            최신 기술과 프리미엄 디자인의 완벽한 조합.
            <br />
            2026년 가장 주목받는 IT 디바이스를 한자리에서 만나보세요.
          </p>

          <div className={`${styles.actions} animate-fadeInUp`} style={{ animationDelay: '0.3s' }}>
            <Link href="/categories">
              <Button size="lg" variant="primary" icon={ArrowRight}>
                Shop Now
              </Button>
            </Link>
          </div>

          <div className={`${styles.trustBadges} animate-fadeInUp`} style={{ animationDelay: '0.4s' }}>
            <div className={styles.badgeItem}>Free Shipping</div>
            <div className={styles.badgeItem}>24h Delivery</div>
            <div className={styles.badgeItem}>4.9/5 Reviews</div>
          </div>
        </div>

        <div className={styles.visual}>
          {mainProduct ? (
            <div className={styles.featuredGrid}>
              <div className={`${styles.mainProduct} animate-scaleIn`} style={{ animationDelay: '0.4s' }}>
                <div className={styles.mainProductImageWrapper}>
                  <ProductImageFallback category={mainProduct.category} size={120} />
                </div>
                <div className={styles.productInfoFloating}>
                  <p className={styles.brandName}>{mainProduct.brand}</p>
                  <p className={styles.productName}>{mainProduct.name}</p>
                  <div className={styles.buyNowBtnWrapper}>
                    <button className={styles.buyNowBtn}>
                      Add to Cart - {mainProduct.price?.toLocaleString?.() ?? 0}원
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.mainImageWrapper}>
              <div className={styles.placeholderImg}>Waiting for Products...</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
