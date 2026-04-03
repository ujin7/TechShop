'use client';

import { useEffect, useState } from 'react';
import { Package, ChevronDown, ChevronUp, X, Box } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { formatPrice } from '@/utils/formatPrice';
import styles from './page.module.css';

const STATUS_LABELS = {
  pending:    { label: '결제 대기', color: 'var(--color-warning)' },
  paid:       { label: '결제 완료', color: 'var(--color-accent)' },
  processing: { label: '처리 중',   color: 'var(--color-accent-2)' },
  shipped:    { label: '배송 중',   color: '#3b82f6' },
  delivered:  { label: '배송 완료', color: 'var(--color-success)' },
  cancelled:  { label: '취소됨',   color: 'var(--color-error)' },
};

function OrderCard({ order, onCancelled }) {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const status = STATUS_LABELS[order.status] || { label: order.status, color: 'var(--text-secondary)' };
  const date = new Date(order.orderedAt).toLocaleDateString('ko-KR');

  const handleCancel = async (e) => {
    e.stopPropagation();
    if (!confirm('주문을 취소하시겠습니까?')) return;
    setCancelling(true);
    const res = await fetchWithAuth('/api/orders', {
      method: 'PATCH',
      body: JSON.stringify({ orderId: order.id }),
    });
    setCancelling(false);
    if (res.ok) {
      const { data } = await res.json();
      onCancelled(data);
    }
  };

  return (
    <div className={styles.orderCard}>
      <div className={styles.orderHeader} onClick={() => setExpanded((v) => !v)}>
        <div className={styles.orderMeta}>
          <span className={styles.orderId}>{order.id}</span>
          <span className={styles.orderDate}>{date}</span>
        </div>
        <div className={styles.orderRight}>
          <span className={styles.statusBadge} style={{ color: status.color, borderColor: status.color }}>
            {status.label}
          </span>
          {order.status === 'pending' && (
            <button
              className={styles.cancelBtn}
              onClick={handleCancel}
              disabled={cancelling}
              title="주문 취소"
            >
              <X size={14} /> {cancelling ? '취소 중...' : '취소'}
            </button>
          )}
          <span className={styles.orderTotal}>{formatPrice(order.total)}</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <div className={styles.orderDetail}>
          {order.items.map((item, i) => (
            <div key={i} className={styles.orderItem}>
              <div className={styles.orderThumb} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-3)', borderRadius: 'var(--radius-sm)' }}>
                <Box size={20} style={{ opacity: 0.4, color: 'var(--text-tertiary)' }} />
              </div>
              <div className={styles.orderItemInfo}>
                <p className={styles.orderItemName}>{item.productName}</p>
                <p className={styles.orderItemMeta}>수량 {item.quantity}개 · {formatPrice(item.price)}</p>
              </div>
            </div>
          ))}
          {order.shipping && (
            <div className={styles.shippingInfo}>
              <p>📦 {order.shipping.recipient} · {order.shipping.address1}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchWithAuth('/api/orders')
      .then((r) => r.ok ? r.json() : { data: [] })
      .then(({ data }) => setOrders(data || []))
      .finally(() => setIsLoading(false));
  }, [user]);

  const handleCancelled = (updated) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <h2 className={styles.title}>주문 내역</h2>
        {[1,2,3].map((i) => (
          <div key={i} style={{ height: 80, background: 'var(--glass-bg)', borderRadius: 12, marginBottom: 12 }} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>주문 내역</h2>

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <Package size={48} style={{ opacity: 0.2 }} />
          <p>주문 내역이 없습니다.</p>
        </div>
      ) : (
        <div className={styles.orderList}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onCancelled={handleCancelled} />
          ))}
        </div>
      )}
    </div>
  );
}
