'use client';

import React, { useEffect } from 'react';
import { X, ShoppingBag, Minus, Plus, Trash2, Package } from 'lucide-react';
import Button from '../ui/Button';
// import formatPrice from '@/utils/formatPrice'; // 만약 있다면 주석 해제. 지금은 자체 포매팅 사용.
import styles from './CartDrawer.module.css';

/**
 * @param {object} props
 * @param {boolean} props.isOpen - Drawer 열림 여부
 * @param {function} props.onClose - Drawer 닫기 파라미터 (바탕 화면 클릭 또는 X 버튼)
 * @param {Array} props.items - 장바구니 아이템 배열 { id, name, price, thumbnail, quantity }
 * @param {function} props.onRemove - 아이템 삭제 콜백 (id)
 * @param {function} props.onUpdateQty - 수량 변경 콜백 (id, delta)
 * @param {function} props.onCheckout - 결제하기 클릭 이벤트
 */
export default function CartDrawer({
  isOpen = false,
  onClose,
  items = [],
  onRemove,
  onUpdateQty,
  onCheckout
}) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 총액 포매팅 (간단하게 프론트엔드 단에서 처리, 나중에 유틸리티로 빼도 무방)
  const cartTotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const formattedTotal = new Intl.NumberFormat('ko-KR').format(cartTotal) + '원';

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.isOpen : ''}`} 
        onClick={onClose}
        aria-hidden="true"
      />

      <aside 
        className={`${styles.drawer} ${isOpen ? styles.isOpen : ''}`}
        aria-modal="true"
        role="dialog"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>
            <ShoppingBag className="text-gradient-cyan" size={24} />
            Your Cart
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="장바구니 닫기">
            <X size={24} />
          </button>
        </div>

        <div className={styles.cartList}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <ShoppingBag size={48} opacity={0.2} />
              <p>장바구니가 비어 있습니다.</p>
              <Button variant="ghost" onClick={onClose}>쇼핑 계속하기</Button>
            </div>
          ) : (
            items.map((item, index) => (
              <div 
                key={item.id} 
                className={styles.cartItem}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.itemImage}>
                  <Package size={24} style={{ opacity: 0.4, color: 'var(--text-tertiary)' }} />
                </div>
                <div className={styles.itemDetails}>
                  <div className={styles.itemHeader}>
                    <h4 className={styles.itemName}>{item.name}</h4>
                    <button 
                      className={styles.removeBtn} 
                      onClick={() => onRemove && onRemove(item.id)}
                      aria-label="상품 삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className={styles.itemPrice}>
                    {new Intl.NumberFormat('ko-KR').format(item.price)}원
                  </div>
                  
                  <div className={styles.qtyControl}>
                    <button 
                      className={styles.qtyBtn} 
                      onClick={() => onUpdateQty && onUpdateQty(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className={styles.qtyNum}>{item.quantity || 1}</span>
                    <button 
                      className={styles.qtyBtn} 
                      onClick={() => onUpdateQty && onUpdateQty(item.id, 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.summaryRow}>
              <span>상품 금액</span>
              <span>{formattedTotal}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>배송비</span>
              <span>무료</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>총 결제금액</span>
              <span className="text-gradient-cyan">{formattedTotal}</span>
            </div>
            <div className={styles.checkoutBtn}>
              <Button 
                style={{ width: '100%' }}
                size="lg" 
                variant="primary"
                onClick={onCheckout}
              >
                결제하기
              </Button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
