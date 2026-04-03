'use client';

import Link from 'next/link';
import { Package, MessageSquare, Settings, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import styles from './page.module.css';

export default function MypageDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const quickLinks = [
    { icon: Package, label: '주문 내역', desc: '최근 주문을 확인하세요', href: '/mypage/orders' },
    { icon: MessageSquare, label: '내 리뷰', desc: '작성한 리뷰를 관리하세요', href: '/mypage/reviews' },
    { icon: Settings, label: '프로필 수정', desc: '계정 정보를 업데이트하세요', href: '/mypage/profile' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        <h1 className={styles.title}>
          안녕하세요, <span className={styles.name}>{user.name}</span>님
        </h1>
        <p className={styles.subtitle}>TechShop 프리미엄 멤버입니다.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>총 주문</p>
          <p className={styles.statValue}>3건</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>작성 리뷰</p>
          <p className={styles.statValue}>2건</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>찜 목록</p>
          <p className={styles.statValue}>0개</p>
        </div>
      </div>

      <div className={styles.quickLinks}>
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={styles.quickLink}>
              <div className={styles.quickLinkIcon}>
                <Icon size={22} />
              </div>
              <div className={styles.quickLinkInfo}>
                <p className={styles.quickLinkLabel}>{item.label}</p>
                <p className={styles.quickLinkDesc}>{item.desc}</p>
              </div>
              <ChevronRight size={18} className={styles.chevron} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
