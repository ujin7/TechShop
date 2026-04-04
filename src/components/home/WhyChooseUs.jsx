'use client';

import { ShieldCheck, Zap, Award, Headset } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import styles from './WhyChooseUs.module.css';

const POINTS = [
  {
    icon: ShieldCheck,
    accent: '#66fcf1',
    label: '정품 100% 보증',
    desc: '국내외 공식 파트너사를 통해 직입고된 정품만 취급합니다. 가품 판매 이력 0건.',
  },
  {
    icon: Zap,
    accent: '#a855f7',
    label: '당일 출고',
    desc: '오후 2시 이전 주문은 당일 출고 처리됩니다. 빠른 배송으로 다음 날 수령 가능.',
  },
  {
    icon: Award,
    accent: '#3b82f6',
    label: '전문가 큐레이션',
    desc: '각 분야 전문가가 직접 선별한 제품만 입점합니다. 스펙 대비 가치를 먼저 검증합니다.',
  },
  {
    icon: Headset,
    accent: '#f97316',
    label: '전담 고객 지원',
    desc: '구매 전 상담부터 AS 연결까지, 전담 매니저가 제품 사용 전 과정을 함께합니다.',
  },
];

export default function WhyChooseUs() {
  const [ref, inView] = useInView();

  return (
    <section ref={ref} className={`${styles.section} ${inView ? styles.visible : ''}`}>
      <div className={styles.bg} />
      <div className="app-container">
        <div className={styles.header}>
          <p className={styles.eyebrow}>Why TechShop</p>
          <h2 className={styles.title}>
            단순한 쇼핑몰이 아닙니다
          </h2>
          <p className={styles.subtitle}>
            프리미엄 IT 기기를 더 현명하게 구매하는 방법
          </p>
        </div>

        <div className={styles.grid}>
          {POINTS.map(({ icon: Icon, accent, label, desc }, i) => (
            <div
              key={label}
              className={styles.card}
              style={{ '--accent': accent, '--delay': `${i * 80}ms` }}
            >
              <div className={styles.iconWrap}>
                <Icon size={22} strokeWidth={1.8} />
              </div>
              <h3 className={styles.cardTitle}>{label}</h3>
              <p className={styles.cardDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
