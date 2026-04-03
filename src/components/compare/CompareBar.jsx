'use client';

import { useRouter } from 'next/navigation';
import { X, BarChart2, Package } from 'lucide-react';
import { useCompare } from '@/hooks/useCompare';
import styles from './CompareBar.module.css';

const MAX_SLOTS = 3;

export default function CompareBar() {
  const router = useRouter();
  const { compareProducts, removeFromCompare, clearCompare } = useCompare();

  if (compareProducts.length === 0) return null;

  const slots = Array.from({ length: MAX_SLOTS }, (_, i) => compareProducts[i] ?? null);
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.slots}>
          {slots.map((product, i) =>
            product ? (
              <div key={product.id} className={styles.slot}>
                <div className={styles.thumb} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={20} style={{ opacity: 0.4, color: 'var(--text-tertiary)' }} />
                </div>
                <p className={styles.slotName}>{product.name}</p>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCompare(product.id)}
                  aria-label={`${product.name} 제거`}
                >
                  <X size={11} />
                </button>
              </div>
            ) : (
              <div key={`empty-${i}`} className={styles.slotEmpty}>
                <span>+ 상품 추가</span>
              </div>
            )
          )}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.compareBtn}
            onClick={() => router.push('/compare')}
            disabled={compareProducts.length < 2}
          >
            <BarChart2 size={15} />
            <span>비교하기</span>
            <span className={styles.compareBadge}>{compareProducts.length}</span>
          </button>
          <button className={styles.clearBtn} onClick={clearCompare}>초기화</button>
        </div>
      </div>
    </div>
  );
}
