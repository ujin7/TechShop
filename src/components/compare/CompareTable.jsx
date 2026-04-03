'use client';

import { X, Package } from 'lucide-react';
import { useCompare } from '@/hooks/useCompare';
import { formatPrice } from '@/utils/formatPrice';
import StarRating from '@/components/product/StarRating';
import styles from './CompareTable.module.css';

const SPEC_LABELS = {
  display: '디스플레이', processor: '프로세서', ram: 'RAM',
  storage: '저장 공간', battery: '배터리', camera: '카메라',
  os: '운영체제', weight: '무게', gpu: 'GPU', ports: '포트',
  size: '화면 크기', resolution: '해상도', panel: '패널',
  refreshRate: '주사율', responseTime: '응답시간', hdr: 'HDR',
  driver: '드라이버', noiseCancelling: '노이즈 캔슬링',
  connectivity: '연결', type: '종류', colors: '색상',
};

const COMMON_ROWS = ['price', 'brand', 'rating', 'weight'];

export default function CompareTable({ products = [] }) {
  const { removeFromCompare } = useCompare();

  if (!products.length) return null;

  // 비교 행 결정: 같은 카테고리면 해당 스펙, 다르면 공통만
  const allSameCategory = products.every((p) => p.category === products[0].category);
  const specKeys = allSameCategory && products[0]?.specs
    ? Object.keys(products[0].specs)
    : [];

  // 수치 비교: 특정 키에서 가장 좋은 값 찾기
  const getBestIdx = (key) => {
    if (key === 'price') {
      // 가격은 낮을수록 좋음
      const vals = products.map((p) => p.price);
      const min = Math.min(...vals);
      return vals.indexOf(min);
    }
    if (key === 'rating') {
      const vals = products.map((p) => p.rating ?? 0);
      const max = Math.max(...vals);
      return vals.indexOf(max);
    }
    return -1;
  };

  const renderCellValue = (product, key) => {
    if (key === 'price') return formatPrice(product.price);
    if (key === 'brand') return product.brand;
    if (key === 'rating') return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <StarRating value={product.rating ?? 0} size="sm" />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{product.rating ?? '-'}</span>
      </div>
    );
    if (key === 'weight') return product.specs?.weight ?? '-';
    return product.specs?.[key] ?? '-';
  };

  const allRows = [...COMMON_ROWS, ...specKeys];

  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.labelCol}>항목</th>
              {products.map((p) => (
                <th key={p.id} className={styles.productCol}>
                  <div className={styles.productHeader}>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeFromCompare(p.id)}
                      aria-label={`${p.name} 비교 제거`}
                    >
                      <X size={16} />
                    </button>
                    <div className={styles.productThumb} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={28} style={{ opacity: 0.4, color: 'var(--text-tertiary)' }} />
                    </div>
                    <p className={styles.productBrand}>{p.brand}</p>
                    <p className={styles.productName}>{p.name}</p>
                    <p className={styles.productPrice}>{formatPrice(p.price)}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allRows.map((key, idx) => {
              const bestIdx = getBestIdx(key);
              return (
                <tr key={key} className={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  <td className={styles.labelCell}>
                    {SPEC_LABELS[key] || key}
                  </td>
                  {products.map((p, pIdx) => (
                    <td
                      key={p.id}
                      className={`${styles.valueCell} ${pIdx === bestIdx ? styles.best : ''}`}
                    >
                      {renderCellValue(p, key)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
