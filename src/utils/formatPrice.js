/**
 * 숫자를 한국 원화 형식으로 포맷합니다.
 * @param {number} price
 * @returns {string} e.g. "1,599,000원"
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) return '0원';
  return price.toLocaleString('ko-KR') + '원';
};

/**
 * 할인율을 계산합니다.
 * @param {number} originalPrice
 * @param {number} salePrice
 * @returns {number} e.g. 15 (%)
 */
export const calcDiscountRate = (originalPrice, salePrice) => {
  if (!originalPrice || originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

/**
 * 배송비를 계산합니다.
 * @param {number} subtotal
 * @returns {number} 배송비 (50,000원 이상 무료)
 */
export const calcShippingFee = (subtotal) => {
  return subtotal >= 50_000 ? 0 : 3_000;
};
