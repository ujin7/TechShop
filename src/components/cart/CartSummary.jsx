/**
 * ## CartSummary
 * 장바구니 금액 요약 박스.
 *
 * ### Props
 * @param {number} subtotal    - 상품 합계
 * @param {number} shippingFee - 배송비 (0이면 "무료" 표시)
 * @param {number} total       - 최종 결제 금액
 *
 * ### 표시
 * 5만원 이상 무료배송 기준선까지 남은 금액 프로그레스 바 (선택)
 */
export default function CartSummary({ subtotal: _subtotal = 0, shippingFee: _shippingFee = 0, total: _total = 0 }) {
  return null; // TODO: Antigravity UI
}
