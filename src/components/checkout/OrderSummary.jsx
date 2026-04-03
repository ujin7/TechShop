import { Package } from 'lucide-react';
import { formatPrice } from '@/utils/formatPrice';
import Button from '@/components/ui/Button';
import styles from './OrderSummary.module.css';

const PAYMENT_LABELS = {
  card: '신용/체크카드', kakaopay: '카카오페이',
  naverpay: '네이버페이', transfer: '계좌이체', vbank: '무통장입금',
};

export default function OrderSummary({
  items = [], shipping = null, paymentMethod = '',
  subtotal = 0, shippingFee = 0, total = 0,
  isSubmitting = false, onConfirm = () => {},
}) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>최종 주문 확인</h2>

      {/* 상품 목록 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>주문 상품</h3>
        <div className={styles.itemList}>
          {items.map((item) => (
            <div key={item.productId} className={styles.item}>
              <div className={styles.thumb} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-3)' }}>
                <Package size={20} style={{ opacity: 0.4, color: 'var(--text-tertiary)' }} />
              </div>
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.itemMeta}>수량 {item.quantity}개</p>
              </div>
              <p className={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 배송지 */}
      {shipping && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>배송지</h3>
          <p className={styles.info}>{shipping.recipient} · {shipping.phone}</p>
          <p className={styles.info}>{shipping.address1} {shipping.address2}</p>
        </div>
      )}

      {/* 결제 수단 */}
      {paymentMethod && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>결제 수단</h3>
          <p className={styles.info}>{PAYMENT_LABELS[paymentMethod] || paymentMethod}</p>
        </div>
      )}

      {/* 금액 요약 */}
      <div className={styles.priceSection}>
        <div className={styles.priceRow}>
          <span>상품 금액</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className={styles.priceRow}>
          <span>배송비</span>
          <span>{shippingFee === 0 ? '무료' : formatPrice(shippingFee)}</span>
        </div>
        <div className={`${styles.priceRow} ${styles.totalRow}`}>
          <span>총 결제 금액</span>
          <span className={styles.totalPrice}>{formatPrice(total)}</span>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        style={{ width: '100%' }}
        onClick={onConfirm}
        disabled={isSubmitting}
      >
        {isSubmitting ? '처리 중...' : `${formatPrice(total)} 결제하기`}
      </Button>

      <p className={styles.notice}>
        주문 내용을 확인하였으며 결제에 동의합니다.
      </p>
    </div>
  );
}
