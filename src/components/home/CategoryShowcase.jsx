'use client';

import Link from 'next/link';
import { ArrowRight, Smartphone, Laptop, Tablet, Monitor, Headphones, Package } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import styles from './CategoryShowcase.module.css';

const ICON_MAP = { Smartphone, Laptop, Tablet, Monitor, Headphones, Package };

export default function CategoryShowcase({ categories = [] }) {
  const [ref, inView] = useInView();

  if (!categories.length) return null;

  return (
    <section ref={ref} className={`${styles.section} ${inView ? styles.visible : ''}`}>
      <div className="app-container">
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Categories</p>
            <h2 className={styles.heading}>원하는 카테고리를 탐색하세요</h2>
          </div>
          <Link href="/categories" className={styles.viewAll}>
            전체 카테고리 <ArrowRight size={15} />
          </Link>
        </div>

        <div className={styles.grid}>
          {categories.map((cat, i) => {
            const Icon = ICON_MAP[cat.icon] || Package;
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className={styles.card}
                style={{ '--cat-color': cat.color, '--delay': `${i * 60}ms` }}
              >
                <div className={styles.iconWrap}>
                  <Icon size={26} strokeWidth={1.6} />
                  <div className={styles.iconGlow} />
                </div>
                <div className={styles.cardText}>
                  <span className={styles.name}>{cat.name}</span>
                  <span className={styles.desc}>{cat.description}</span>
                </div>
                {cat.productCount != null && (
                  <span className={styles.count}>{cat.productCount}개</span>
                )}
                <ArrowRight size={14} className={styles.arrow} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
