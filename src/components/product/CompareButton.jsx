'use client';

import { GitCompareArrows } from 'lucide-react';
import { useCompare } from '@/hooks/useCompare';
import styles from './CompareButton.module.css';

export default function CompareButton({ product, variant = 'full' }) {
  const { isInCompare, addToCompare, removeFromCompare, isFull } = useCompare();
  const active = isInCompare(product?.id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (active) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  return (
    <button
      className={`${styles.btn} ${active ? styles.active : ''} ${styles[variant]}`}
      onClick={handleClick}
      title={active ? '비교 목록에서 제거' : isFull ? '비교 목록이 가득 찼습니다' : '비교에 추가'}
    >
      {variant !== 'text' && <GitCompareArrows size={14} />}
      {variant !== 'icon' && <span>{active ? '비교 중' : '비교 추가'}</span>}
    </button>
  );
}
