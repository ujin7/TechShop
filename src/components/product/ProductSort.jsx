'use client';

import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { SORT_OPTIONS } from '@/utils/filterProducts';
import styles from './ProductSort.module.css';

export default function ProductSort({
  sortOption = 'popular', onSortChange = () => {},
  totalCount = 0,
  layout = 'grid', onLayoutChange = () => {},
  onMobileFilterOpen = () => {},
}) {
  return (
    <div className={styles.bar}>
      <p className={styles.count}>
        <span className={styles.countNum}>{totalCount.toLocaleString('ko-KR')}</span>개 상품
      </p>

      <select
        className={styles.sortSelect}
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="정렬 기준"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <div className={styles.actions}>
        <div className={styles.layoutToggle}>
          <button
            className={`${styles.layoutBtn} ${layout === 'grid' ? styles.layoutBtnActive : ''}`}
            onClick={() => onLayoutChange('grid')}
            aria-label="그리드 보기"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            className={`${styles.layoutBtn} ${layout === 'list' ? styles.layoutBtnActive : ''}`}
            onClick={() => onLayoutChange('list')}
            aria-label="리스트 보기"
          >
            <List size={16} />
          </button>
        </div>

        <button className={styles.mobileFilterBtn} onClick={onMobileFilterOpen} aria-label="필터">
          <SlidersHorizontal size={16} />
          <span>필터</span>
        </button>
      </div>
    </div>
  );
}
