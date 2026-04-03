'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, MessageSquare, Settings, LogOut, Heart } from 'lucide-react';
import styles from './MypageSidebar.module.css';

/**
 * @param {object} props
 * @param {object} props.user - 유저 정보 데이터 (name, email 등)
 * @param {function} props.onLogout - 로그아웃 콜백
 */
export default function MypageSidebar({ 
  user = { name: 'Guest', email: 'guest@techshop.com' }, 
  onLogout 
}) {
  const pathname = usePathname(); // Next.js App Router용 활성 링크 판별

  const navItems = [
    { name: '대시보드', href: '/mypage', icon: User },
    { name: '주문 내역', href: '/mypage/orders', icon: Package },
    { name: '찜 목록', href: '/mypage/wishlist', icon: Heart },
    { name: '내 리뷰', href: '/mypage/reviews', icon: MessageSquare },
    { name: '프로필 수정', href: '/mypage/profile', icon: Settings },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profile}>
        <div className={styles.avatar}>
          <User size={24} />
        </div>
        <div className={styles.userInfo}>
          <span className={styles.name}>{user.name}</span>
          <span className={styles.email}>{user.email}</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`${styles.link} ${isActive ? styles.active : ''}`}
            >
              <item.icon className={styles.icon} size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button className={styles.logoutBtn} onClick={onLogout}>
        <LogOut size={18} />
        로그아웃
      </button>
    </aside>
  );
}
