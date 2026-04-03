export const formatPrice = (price) => {
  if (typeof price !== 'number' || Number.isNaN(price)) return '0원';
  return `${price.toLocaleString('ko-KR')}원`;
};

export const calcDiscountRate = (originalPrice, salePrice) => {
  if (!originalPrice || originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

export const calcShippingFee = (subtotal) => {
  return subtotal >= 50_000 ? 0 : 3_000;
};
