'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentMethod from '@/components/checkout/PaymentMethod';
import OrderSummary from '@/components/checkout/OrderSummary';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

const STEPS = ['배송 정보', '결제 수단', '주문 확인'];

const breadcrumbs = [
  { label: '홈', href: '/' },
  { label: '결제' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, total, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // 로그인 확인
  if (!user && !orderId) {
    return (
      <div style={{ minHeight: '100vh', padding: '80px 0', textAlign: 'center' }}>
        <div className="app-container">
          <h2 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>로그인이 필요합니다</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>결제를 진행하려면 로그인해주세요.</p>
          <Button variant="primary" onClick={() => router.push('/')}>홈으로 돌아가기</Button>
        </div>
      </div>
    );
  }

  // 장바구니 비어있음
  if (items.length === 0 && !orderId) {
    return (
      <div style={{ minHeight: '100vh', padding: '80px 0', textAlign: 'center' }}>
        <div className="app-container">
          <h2 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>장바구니가 비어있습니다</h2>
          <Button variant="primary" onClick={() => router.push('/')}>쇼핑 계속하기</Button>
        </div>
      </div>
    );
  }

  // 주문 완료
  if (orderId) {
    return (
      <div style={{ minHeight: '100vh', padding: '80px 0' }}>
        <div className="app-container" style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(34,197,94,0.15)', border: '2px solid var(--color-success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <CheckCircle2 size={40} color="var(--color-success)" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
            주문 완료!
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
            주문번호: <strong style={{ color: 'var(--color-accent)' }}>{orderId}</strong>
          </p>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginBottom: 32 }}>
            결제가 완료되었습니다. 빠른 배송으로 찾아뵙겠습니다!
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button variant="outline" onClick={() => router.push('/mypage/orders')}>
              주문 내역 보기
            </Button>
            <Button variant="primary" onClick={() => router.push('/')}>
              계속 쇼핑하기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (data) => {
    setShipping(data);
    setStep(1);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const { fetchWithAuth } = await import('@/utils/fetchWithAuth');
      const res = await fetchWithAuth('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.name,
            thumbnail: i.thumbnail,
            price: i.price,
            quantity: i.quantity,
          })),
          shipping,
          paymentMethod,
          subtotal,
          shippingFee,
          total,
        }),
      });
      if (res.ok) {
        const { data } = await res.json();
        setOrderId(data.id);
        clearCart();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="app-container">
        <Breadcrumb items={breadcrumbs} />

        {/* 스텝 인디케이터 */}
        <div className={styles.stepper}>
          {STEPS.map((label, i) => (
            <div key={i} className={`${styles.stepItem} ${i <= step ? styles.active : ''}`}>
              <div className={styles.stepCircle}>{i + 1}</div>
              <span className={styles.stepLabel}>{label}</span>
              {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < step ? styles.done : ''}`} />}
            </div>
          ))}
        </div>

        <div className={styles.layout}>
          <div className={styles.formArea}>
            {step === 0 && (
              <ShippingForm
                onSubmit={handleShippingSubmit}
                defaultValues={shipping}
              />
            )}
            {step === 1 && (
              <div>
                <PaymentMethod selected={paymentMethod} onSelect={setPaymentMethod} />
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <Button variant="outline" onClick={() => setStep(0)}>← 이전</Button>
                  <Button variant="primary" onClick={() => setStep(2)} style={{ flex: 1 }}>
                    다음 단계 →
                  </Button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Button variant="outline" onClick={() => setStep(1)}>← 이전</Button>
              </div>
            )}
          </div>

          <div className={styles.summaryArea}>
            <OrderSummary
              items={items.map((i) => ({
                productId: i.productId, name: i.name,
                thumbnail: i.thumbnail, price: i.price, quantity: i.quantity,
              }))}
              shipping={shipping}
              paymentMethod={paymentMethod}
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              isSubmitting={isSubmitting}
              onConfirm={step === 2 ? handleConfirm : () => setStep(2)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
