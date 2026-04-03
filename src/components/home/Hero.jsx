'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronRight,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import Button from '../ui/Button';
import styles from './Hero.module.css';

const SHOWCASE_PRODUCTS = [
  {
    id: 1,
    category: 'smartphones',
    badge: 'BEST SELLER',
    name: 'Galaxy S25 Ultra',
    brand: 'Samsung',
    spec: 'Snapdragon 8 Elite · 200MP 카메라',
    accent: '#3b82f6',
    gradient: 'linear-gradient(145deg, #0a1428 0%, #0f1e3d 60%, #0a1530 100%)',
  },
  {
    id: 2,
    category: 'laptops',
    badge: 'EDITOR PICK',
    name: 'MacBook Pro 16"',
    brand: 'Apple',
    spec: 'M4 Pro · 48GB RAM',
    accent: '#a855f7',
    gradient: 'linear-gradient(145deg, #120a22 0%, #1e0f38 60%, #130a2a 100%)',
  },
  {
    id: 3,
    category: 'audio',
    badge: 'TOP RATED',
    name: 'WH-1000XM6',
    brand: 'Sony',
    spec: '30dB ANC · LDAC Hi-Res',
    accent: '#22c55e',
    gradient: 'linear-gradient(145deg, #071a0e 0%, #0d2b17 60%, #071a0e 100%)',
  },
];

const CATEGORY_LINKS = [
  { label: '스마트폰', href: '/categories/smartphones' },
  { label: '노트북', href: '/categories/laptops' },
  { label: '태블릿', href: '/categories/tablets' },
  { label: '모니터', href: '/categories/monitors' },
  { label: '오디오', href: '/categories/audio' },
];

const BRANDS = ['Apple', 'Samsung', 'Sony', 'LG', 'ASUS', 'Bose'];

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [inView, setInView] = useState(false);
  const [activeProduct, setActiveProduct] = useState(0);
  const [activeVisitors, setActiveVisitors] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePos({
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = sectionRef.current;
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const goToNext = useCallback(() => {
    setIsTransitioning(true);

    window.setTimeout(() => {
      setActiveProduct((prev) => (prev + 1) % SHOWCASE_PRODUCTS.length);
      setIsTransitioning(false);
    }, 300);
  }, []);

  useEffect(() => {
    intervalRef.current = window.setInterval(goToNext, 4500);
    return () => window.clearInterval(intervalRef.current);
  }, [goToNext]);

  useEffect(() => {
    let cancelled = false;

    const fetchPresence = async () => {
      try {
        const response = await fetch('/api/presence', { cache: 'no-store' });
        if (!response.ok || cancelled) return;

        const data = await response.json();
        if (typeof data?.count === 'number') {
          setActiveVisitors(data.count);
        }
      } catch (error) {
        console.error('Failed to fetch active visitors:', error);
      }
    };

    const handlePresenceUpdate = (event) => {
      const nextCount = event?.detail?.count;
      if (typeof nextCount === 'number') {
        setActiveVisitors(nextCount);
      }
    };

    void fetchPresence();
    window.addEventListener('techshop:presence-update', handlePresenceUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener('techshop:presence-update', handlePresenceUpdate);
    };
  }, []);

  const handleDotClick = (index) => {
    window.clearInterval(intervalRef.current);
    setIsTransitioning(true);

    window.setTimeout(() => {
      setActiveProduct(index);
      setIsTransitioning(false);
    }, 300);

    intervalRef.current = window.setInterval(goToNext, 4500);
  };

  const product = SHOWCASE_PRODUCTS[activeProduct];
  const visitorLabel =
    typeof activeVisitors === 'number' ? activeVisitors.toLocaleString() : '...';

  return (
    <section
      ref={sectionRef}
      className={`${styles.hero} ${inView ? styles.heroIn : ''}`}
    >
      <div className={styles.gridOverlay} />
      <div className={styles.noiseOverlay} />
      <div
        className={styles.bgGlow1}
        style={{ transform: `translate(${mousePos.x * 44}px, ${mousePos.y * 44}px)` }}
      />
      <div
        className={styles.bgGlow2}
        style={{ transform: `translate(${mousePos.x * -60}px, ${mousePos.y * -60}px)` }}
      />
      <div className={styles.bgGlow3} />

      <div className={`app-container ${styles.container}`}>
        <div className={styles.left}>
          <div className={`${styles.liveBadge} ${styles.entry}`} style={{ '--d': '0ms' }}>
            <span className={styles.liveDot} />
            <Users size={12} />
            <span>
              지금 <strong>{visitorLabel}</strong>명이 쇼핑 중
            </span>
          </div>

          <div className={`${styles.copyBlock} ${styles.entry}`} style={{ '--d': '60ms' }}>
            <p className={styles.eyebrow}>
              <Zap size={14} className={styles.eyebrowIcon} />
              2026 Premium Tech Curation
            </p>
            <h1 className={styles.title}>
              최고급 기술,
              <br />
              <span className={styles.titleGradient}>감각적인 선택</span>
            </h1>
            <p className={styles.description}>
              국내외 프리미엄 IT 기기를 한곳에 모았습니다.
              <br />
              복잡한 비교보다 빠른 발견과 자연스러운 구매 흐름에 집중했습니다.
            </p>
          </div>

          <div className={`${styles.actions} ${styles.entry}`} style={{ '--d': '140ms' }}>
            <Link href="/categories">
              <Button size="lg" variant="primary" icon={ArrowRight} className={styles.ctaPrimary}>
                전체 카테고리 보기
              </Button>
            </Link>
            <Link href="/compare">
              <Button size="lg" variant="ghost" className={styles.ctaSecondary}>
                비교 바로 시작하기
              </Button>
            </Link>
          </div>

          <div className={`${styles.quickLinks} ${styles.entry}`} style={{ '--d': '200ms' }}>
            {CATEGORY_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} className={styles.quickLink}>
                {label}
                <ChevronRight size={11} />
              </Link>
            ))}
          </div>

          <div className={`${styles.brandStrip} ${styles.entry}`} style={{ '--d': '270ms' }}>
            <span className={styles.brandLabel}>공식 파트너 브랜드</span>
            <div className={styles.brands}>
              {BRANDS.map((brand) => (
                <span key={brand} className={styles.brand}>
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={`${styles.right} ${styles.entry}`} style={{ '--d': '80ms' }}>
          <div
            className={styles.showcaseCard}
            style={{
              background: product.gradient,
              '--accent': product.accent,
              '--mx': mousePos.x,
              '--my': mousePos.y,
            }}
          >
            <div className={styles.cardSheen} />

            <div
              className={styles.productBadge}
              style={{
                background: `${product.accent}1a`,
                borderColor: `${product.accent}44`,
                color: product.accent,
              }}
            >
              <Sparkles size={11} />
              {product.badge}
            </div>

            <div
              className={`${styles.productVisual} ${
                isTransitioning ? styles.visualOut : styles.visualIn
              }`}
            >
              <div
                className={styles.productIconBg}
                style={{
                  background: `radial-gradient(circle, ${product.accent}28 0%, transparent 72%)`,
                }}
              >
                <div
                  className={styles.productGlowRing}
                  style={{ borderColor: `${product.accent}44` }}
                />
                <span className={styles.productCategoryLabel}>{product.category}</span>
              </div>

              <div className={styles.productInfo}>
                <span className={styles.productBrand}>{product.brand}</span>
                <span className={styles.productName}>{product.name}</span>
                <span className={styles.productSpec}>{product.spec}</span>
              </div>
            </div>

            <div className={styles.dotIndicators}>
              {SHOWCASE_PRODUCTS.map((item, index) => (
                <button
                  key={item.id}
                  className={`${styles.dot} ${index === activeProduct ? styles.dotActive : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`${item.name} 보기`}
                />
              ))}
            </div>
          </div>

          <div className={styles.sideMetrics}>
            <div className={styles.sideMetric}>
              <Shield size={15} className={styles.sideMetricIcon} />
              <div>
                <span className={styles.sideMetricValue}>100%</span>
                <span className={styles.sideMetricLabel}>정품 보증</span>
              </div>
            </div>
            <div className={styles.sideMetricDivider} />
            <div className={styles.sideMetric}>
              <Zap size={15} className={styles.sideMetricIcon} />
              <div>
                <span className={styles.sideMetricValue}>당일</span>
                <span className={styles.sideMetricLabel}>출고 대응</span>
              </div>
            </div>
            <div className={styles.sideMetricDivider} />
            <div className={styles.sideMetric}>
              <Star size={15} className={styles.sideMetricIcon} />
              <div>
                <span className={styles.sideMetricValue}>엄선</span>
                <span className={styles.sideMetricLabel}>인기 제품 큐레이션</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.scrollHint} ${inView ? styles.scrollHintIn : ''}`}>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
      </div>
    </section>
  );
}
