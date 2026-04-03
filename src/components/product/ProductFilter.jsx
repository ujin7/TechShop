'use client';

import { X, SlidersHorizontal } from 'lucide-react';
import styles from './ProductFilter.module.css';

export default function ProductFilter({
  filters = {}, setFilter = () => {}, toggleBrand = () => {},
  resetFilters = () => {}, hasActiveFilters = false,
  availableBrands = [], priceRange = [0, 10000000],
  isMobileOpen = false, onMobileClose = () => {},
}) {
  const activeCount = [
    filters.minPrice != null, filters.maxPrice != null,
    filters.brands?.length > 0, filters.minRating != null,
    filters.inStockOnly,
  ].filter(Boolean).length;

  const sidebar = (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <SlidersHorizontal size={15} />
          <span className={styles.headerTitle}>필터</span>
          {hasActiveFilters && <span className={styles.badge}>{activeCount}</span>}
        </div>
        <div className={styles.headerRight}>
          {hasActiveFilters && (
            <button className={styles.resetBtn} onClick={resetFilters}>초기화</button>
          )}
          <button className={styles.closeBtn} onClick={onMobileClose} aria-label="닫기">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* 가격 범위 */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>가격 범위</h3>
        <div className={styles.priceInputs}>
          <input
            type="number" className={styles.priceInput}
            placeholder={`최소 ${(priceRange[0] / 10000).toFixed(0)}만`}
            value={filters.minPrice ?? ''}
            onChange={(e) => setFilter('minPrice', e.target.value ? Number(e.target.value) : null)}
          />
          <span className={styles.priceSep}>~</span>
          <input
            type="number" className={styles.priceInput}
            placeholder={`최대 ${(priceRange[1] / 10000).toFixed(0)}만`}
            value={filters.maxPrice ?? ''}
            onChange={(e) => setFilter('maxPrice', e.target.value ? Number(e.target.value) : null)}
          />
        </div>
      </section>

      {/* 브랜드 */}
      {availableBrands.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>브랜드</h3>
          <ul className={styles.brandList}>
            {availableBrands.map((brand) => {
              const checked = filters.brands?.includes(brand) ?? false;
              return (
                <li key={brand}>
                  <label className={styles.checkLabel}>
                    <input type="checkbox" className={styles.checkbox} checked={checked} onChange={() => toggleBrand(brand)} />
                    <span className={styles.checkMark} />
                    <span className={styles.brandName}>{brand}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* 최소 평점 */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>최소 평점</h3>
        <div className={styles.ratingBtns}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`${styles.ratingBtn} ${filters.minRating === n ? styles.ratingBtnActive : ''}`}
              onClick={() => setFilter('minRating', filters.minRating === n ? null : n)}
            >
              {'★'.repeat(n)}{'☆'.repeat(5 - n)}
            </button>
          ))}
        </div>
      </section>

      {/* 재고 있음 */}
      <section className={styles.section}>
        <div className={styles.stockRow}>
          <span className={styles.stockLabel}>재고 있음</span>
          <button
            role="switch" aria-checked={!!filters.inStockOnly}
            className={`${styles.toggle} ${filters.inStockOnly ? styles.toggleOn : ''}`}
            onClick={() => setFilter('inStock', !filters.inStockOnly)}
          >
            <span className={styles.toggleThumb} />
          </button>
        </div>
      </section>
    </aside>
  );

  return (
    <>
      <div className={styles.desktopWrapper}>{sidebar}</div>
      {isMobileOpen && (
        <div className={styles.overlay} onClick={onMobileClose}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            {sidebar}
          </div>
        </div>
      )}
    </>
  );
}
