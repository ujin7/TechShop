'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

/**
 * URL searchParams 기반 필터 훅.
 * setFilter 호출 → router.push → Server Component 재실행 → 새 데이터 fetch.
 *
 * URL 형태: /categories/laptops/ultrabook?brands=Apple,LG&minPrice=100000&sort=popular
 */
export function useUrlFilter() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  /* URL → 필터 객체 파싱 (안정적인 메모이제이션) */
  const filters = useMemo(() => ({
    brands:      searchParams.get('brands')?.split(',').filter(Boolean) ?? [],
    minPrice:    searchParams.get('minPrice')  ? Number(searchParams.get('minPrice'))  : null,
    maxPrice:    searchParams.get('maxPrice')  ? Number(searchParams.get('maxPrice'))  : null,
    minRating:   searchParams.get('minRating') ? Number(searchParams.get('minRating')) : null,
    inStockOnly: searchParams.get('inStock') === 'true',
    sort:        searchParams.get('sort') ?? 'popular',
    q:           searchParams.get('q') ?? '',
    page:        Number(searchParams.get('page') ?? 1),
  }), [searchParams]);

  /**
   * 단일 필터 값 변경 → URL push
   * key: 'brands' | 'minPrice' | 'maxPrice' | 'minRating' | 'inStock' | 'sort' | 'q' | 'page'
   */
  const setFilter = useCallback((key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    const isEmpty =
      value == null ||
      value === '' ||
      value === false ||
      (Array.isArray(value) && value.length === 0);

    if (isEmpty) {
      params.delete(key);
    } else {
      params.set(key, Array.isArray(value) ? value.join(',') : String(value));
    }

    /* 필터 변경 시 1페이지로 리셋 (page 변경 자신은 예외) */
    if (key !== 'page') params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  /** 브랜드 토글 헬퍼 */
  const toggleBrand = useCallback((brand) => {
    const current = filters.brands;
    const next = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    setFilter('brands', next);
  }, [filters.brands, setFilter]);

  /** 전체 필터 초기화 (sort 유지) */
  const resetFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.sort !== 'popular') params.set('sort', filters.sort);
    router.push(`${pathname}${params.toString() ? '?' + params.toString() : ''}`, { scroll: false });
  }, [router, pathname, filters.sort]);

  /** 현재 URL searchParams → API query string 변환 */
  const toApiQuery = useCallback((extra = {}) => {
    const params = new URLSearchParams();
    if (filters.brands.length)  params.set('brands',    filters.brands.join(','));
    if (filters.minPrice != null) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice != null) params.set('maxPrice', String(filters.maxPrice));
    if (filters.minRating)      params.set('minRating', String(filters.minRating));
    if (filters.inStockOnly)    params.set('inStock',   'true');
    if (filters.sort !== 'popular') params.set('sort',  filters.sort);
    if (filters.q)              params.set('q',         filters.q);
    params.set('page', String(filters.page));
    Object.entries(extra).forEach(([k, v]) => v != null && params.set(k, String(v)));
    return params.toString();
  }, [filters]);

  const hasActiveFilters = useMemo(
    () =>
      filters.brands.length > 0 ||
      filters.minPrice != null ||
      filters.maxPrice != null ||
      filters.minRating != null ||
      filters.inStockOnly ||
      filters.q !== '',
    [filters]
  );

  return { filters, setFilter, toggleBrand, resetFilters, toApiQuery, hasActiveFilters };
}
