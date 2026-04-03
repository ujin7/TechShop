'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './FeaturedBanner.module.css';

export default function FeaturedBanner({ banners = [] }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  if (!banners.length) return null;

  const banner = banners[current];

  return (
    <section className={styles.section}>
      <div className="app-container">
        <div
          className={styles.banner}
          style={{ '--bg-color': banner.bgColor, '--accent': banner.accentColor }}
        >
          <div className={styles.bg} />
          <div className={styles.overlay}>
            <p className={styles.subtitle}>{banner.subtitle}</p>
            <h2 className={styles.title}>{banner.title}</h2>
            {banner.ctaHref && (
              <Link href={banner.ctaHref} className={styles.cta}>
                {banner.ctaText || '자세히 보기'}
              </Link>
            )}
          </div>
          {banners.length > 1 && (
            <div className={styles.dots}>
              {banners.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`배너 ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
