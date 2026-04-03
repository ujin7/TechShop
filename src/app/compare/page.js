'use client';

import Link from 'next/link';
import { Activity } from 'lucide-react';
import { useCompare } from '@/hooks/useCompare';
import CompareTable from '@/components/compare/CompareTable';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/ui/Breadcrumb';

const breadcrumbs = [
  { label: '홈', href: '/' },
  { label: '상품 비교' },
];

export default function ComparePage() {
  const { compareProducts, clearCompare } = useCompare();

  return (
    <div style={{ minHeight: '100vh', padding: '32px 0 80px' }}>
      <div className="app-container">
        <Breadcrumb items={breadcrumbs} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 32,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 8,
              }}
            >
              상품 비교
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>{compareProducts.length}개 상품 비교 중</p>
          </div>
          {compareProducts.length > 0 && (
            <Button variant="ghost" onClick={clearCompare}>
              비교 초기화
            </Button>
          )}
        </div>

        {compareProducts.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 0',
              gap: 20,
              textAlign: 'center',
            }}
          >
            <Activity size={64} style={{ opacity: 0.2, color: 'var(--color-accent)' }} />
            <h2 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              비교할 상품이 없습니다
            </h2>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              상품 카드의 비교 버튼을 눌러 최대 3개까지 비교해보세요.
            </p>
            <Link href="/">
              <Button variant="primary">쇼핑 시작하기</Button>
            </Link>
          </div>
        ) : (
          <CompareTable products={compareProducts} />
        )}
      </div>
    </div>
  );
}
