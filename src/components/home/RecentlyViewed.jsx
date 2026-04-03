'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { getRecentlyViewed } from '@/utils/localStorage';
import styles from './RecentlyViewed.module.css';

export default function RecentlyViewed({ products: propProducts }) {
  const [products, setProducts] = useState(propProducts || []);
  const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

  useEffect(() => {
    if (propProducts) return;
    const ids = getRecentlyViewed();
    if (!ids.length) return;
    fetch(`/api/products?ids=${ids.join(',')}`)
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        if (json?.data) setProducts(json.data.slice(0, 6));
      })
      .catch(() => {});
  }, [propProducts]);

  if (!products.length) return null;

  return (
    <section className={styles.section}>
      <div className="app-container">
        <h2 className={styles.heading}>
          <Clock size={18} />
          최근 본 상품
        </h2>
        <div className={styles.list}>
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className={styles.item}>
              <div className={styles.imgWrap}>
                <Image
                  src={p.thumbnail || p.images?.[0] || EMPTY_IMAGE}
                  alt={p.name}
                  fill
                  sizes="80px"
                  style={{ objectFit: 'contain' }}
                  unoptimized
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = EMPTY_IMAGE;
                  }}
                />
              </div>
              <div className={styles.info}>
                <span className={styles.brand}>{p.brand}</span>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.price}>
                  {p.price?.toLocaleString('ko-KR')}원
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
