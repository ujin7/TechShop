'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import MypageSidebar from '@/components/layout/MypageSidebar';
import styles from './layout.module.css';

export default function MypageLayout({ children }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', padding: '80px 0', textAlign: 'center' }}>
        <div className="app-container">
          <h2 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>로그인이 필요합니다</h2>
          <button
            onClick={() => router.push('/')}
            style={{ color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
          >
            ← 홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className={styles.page}>
      <div className="app-container">
        <div className={styles.layout}>
          <MypageSidebar user={user} onLogout={handleLogout} />
          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
