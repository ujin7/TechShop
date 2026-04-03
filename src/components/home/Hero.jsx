'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import styles from './Hero.module.css';

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [inView, setInView] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setInView(true);
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 24) setHasScrolled(true);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.hero} ${inView ? styles.heroIn : ''} ${hasScrolled ? styles.scrolled : ''}`}
    >
      <div
        className={styles.bgGlow1}
        style={{ transform: `translate(${mousePos.x * 36}px, ${mousePos.y * 36}px)` }}
      />
      <div
        className={styles.bgGlow2}
        style={{ transform: `translate(${mousePos.x * -52}px, ${mousePos.y * -52}px)` }}
      />

      <div className={`app-container ${styles.container}`}>
        <div className={styles.content}>
          <div className={`${styles.badge} ${styles.entry}`} style={{ '--d': '20ms' }}>
            <Sparkles size={14} />
            2026 TECH CURATION
          </div>

          <div className={`${styles.copyBlock} ${styles.entry}`} style={{ '--d': '80ms' }}>
            <p className={styles.eyebrow}>Curated tech, made effortless</p>

            <h1 className={styles.title}>
              지금 가장 주목할
              <br />
              프리미엄 디바이스
            </h1>

            <p className={styles.description}>
              복잡한 비교는 덜어내고, 눈에 잘 들어오는 구성으로 인기 제품 빠르게 살펴보세요.
              <br />
              탐색부터 비교, 구매 결정까지 더 자연스럽게 이어집니다.
            </p>
          </div>

          <div className={`${styles.actions} ${styles.entry}`} style={{ '--d': '160ms' }}>
            <Link href="/categories">
              <Button size="lg" variant="primary" icon={ArrowRight} className={styles.ctaPrimary}>
                전체 카테고리 보기
              </Button>
            </Link>
            <Link href="/compare">
              <Button size="lg" variant="ghost" className={`${styles.secondaryBtn} ${styles.ctaSecondary}`}>
                비교 바로 시작하기
              </Button>
            </Link>
          </div>

          <div className={`${styles.metrics} ${styles.entry}`} style={{ '--d': '240ms' }}>
            <div className={`${styles.metricCard} ${styles.metricCardCopy}`}>
              <span className={styles.metricCopyTitle}>엄선된</span>
              <span className={styles.metricCopyText}>인기 제품</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>4.9</span>
              <span className={styles.metricLabel}>평균 만족도</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>24H</span>
              <span className={styles.metricLabel}>빠른 출고 대응</span>
            </div>
          </div>

          <div className={`${styles.trustBadges} ${styles.entry}`} style={{ '--d': '320ms' }}>
            <div className={styles.badgeItem}>무료 배송 상품 큐레이션</div>
            <div className={styles.badgeItem}>실시간 인기 카테고리 반영</div>
            <div className={styles.badgeItem}>비교 기능으로 빠른 결정</div>
          </div>
        </div>
      </div>
    </section>
  );
}
