'use client';

import { CreditCard, Building2, Smartphone } from 'lucide-react';
import styles from './PaymentMethod.module.css';

const METHODS = [
  { key: 'card',      label: '신용/체크카드',   icon: CreditCard,   desc: '국내외 모든 카드' },
  { key: 'kakaopay',  label: '카카오페이',       icon: Smartphone,   desc: '카카오 간편결제' },
  { key: 'naverpay',  label: '네이버페이',       icon: Smartphone,   desc: '네이버 간편결제' },
  { key: 'transfer',  label: '계좌이체',         icon: Building2,    desc: '실시간 계좌이체' },
  { key: 'vbank',     label: '무통장입금',       icon: Building2,    desc: '가상계좌 입금' },
];

export default function PaymentMethod({ selected = 'card', onSelect = () => {} }) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>결제 수단</h2>
      <div className={styles.list}>
        {METHODS.map((method) => {
          const Icon = method.icon;
          const isSelected = selected === method.key;
          return (
            <button
              key={method.key}
              type="button"
              className={`${styles.item} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelect(method.key)}
            >
              <div className={`${styles.radio} ${isSelected ? styles.radioActive : ''}`} />
              <Icon size={20} className={styles.icon} />
              <div className={styles.info}>
                <span className={styles.label}>{method.label}</span>
                <span className={styles.desc}>{method.desc}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
