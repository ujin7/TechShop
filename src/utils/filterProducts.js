/**
 * 상품 필터링 & 정렬 순수 함수
 */

export const SORT_OPTIONS = [
  { value: 'popular',     label: '인기순' },
  { value: 'newest',      label: '최신순' },
  { value: 'price-asc',   label: '가격 낮은순' },
  { value: 'price-desc',  label: '가격 높은순' },
  { value: 'rating',      label: '평점순' },
];

/**
 * @param {Array}  products
 * @param {Object} filters  { priceMin, priceMax, brands[], minRating, inStockOnly }
 * @param {string} sortOption
 * @param {string} searchQuery
 * @returns {Array}
 */
export const filterProducts = (products, filters = {}, sortOption = 'popular', searchQuery = '') => {
  let result = [...products];

  /* 검색어 필터 */
  if (searchQuery.trim()) {
    // 띄어쓰기 차이를 무시하기 위해 공백을 압축한 버전도 함께 비교
    const normalize = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
    const compact   = (s) => s.toLowerCase().replace(/\s+/g, '');

    const tokens = normalize(searchQuery).split(' ').filter(Boolean);
    const qCompact = compact(searchQuery);

    result = result.filter((p) => {
      const fields = [
        p.name, p.brand,
        ...(p.tags ?? []),
        p.description ?? '',
      ].map((f) => f?.toLowerCase() ?? '');

      const fieldsNorm    = fields.map(normalize);
      const fieldsCompact = fields.map(compact);

      // 1) 공백 압축 문자열이 어느 필드에 포함되는가
      if (fieldsCompact.some((f) => f.includes(qCompact))) return true;

      // 2) 모든 토큰이 (name 또는 brand 또는 tags) 중 하나에 포함되는가
      return tokens.every((token) =>
        fieldsNorm.some((f) => f.includes(token))
      );
    });
  }

  /* 가격 범위 */
  if (filters.priceMin != null) {
    result = result.filter((p) => p.price >= filters.priceMin);
  }
  if (filters.priceMax != null) {
    result = result.filter((p) => p.price <= filters.priceMax);
  }

  /* 브랜드 */
  if (filters.brands?.length) {
    result = result.filter((p) => filters.brands.includes(p.brand));
  }

  /* 최소 평점 */
  if (filters.minRating) {
    result = result.filter((p) => p.rating >= filters.minRating);
  }

  /* 재고 있음 */
  if (filters.inStockOnly) {
    result = result.filter((p) => p.stock > 0);
  }

  /* 정렬 */
  switch (sortOption) {
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'popular':
    default:
      result.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
  }

  return result;
};

/**
 * 상품 배열에서 가능한 브랜드 목록 추출
 */
export const extractBrands = (products) => [
  ...new Set(products.map((p) => p.brand)),
].sort();

/**
 * 상품 배열에서 가격 범위 추출
 */
export const extractPriceRange = (products) => {
  if (!products.length) return [0, 10_000_000];
  const prices = products.map((p) => p.price);
  return [Math.min(...prices), Math.max(...prices)];
};
