'use client';
/**
 * ## CartItem
 * 장바구니 개별 상품 행.
 *
 * ### Props
 * @param {{ productId, name, price, thumbnail, quantity, maxStock }} item
 * @param {function} onRemove    - (productId) => void
 * @param {function} onUpdateQty - (productId, qty) => void
 */
export default function CartItem({ item: _item, onRemove: _onRemove = () => {}, onUpdateQty: _onUpdateQty = () => {} }) {
  return null; // TODO: Antigravity UI
}
