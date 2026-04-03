'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [saved, setSaved] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ name: form.name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    setPwLoading(true);
    const res = await fetchWithAuth('/api/auth/password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
    });
    const json = await res.json();
    setPwLoading(false);
    if (res.ok) {
      setPwSuccess(true);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwSuccess(false), 3000);
    } else {
      setPwError(json.error);
    }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>프로필 수정</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>이름</label>
          <input
            className={styles.input}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="이름"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>이메일</label>
          <input
            className={styles.input}
            value={form.email}
            readOnly
            style={{ opacity: 0.6, cursor: 'not-allowed' }}
          />
          <p className={styles.hint}>이메일은 변경할 수 없습니다.</p>
        </div>

        <Button type="submit" variant="primary" size="lg" style={{ alignSelf: 'flex-start' }}>
          {saved ? '저장됨 ✓' : '변경사항 저장'}
        </Button>
      </form>

      <hr className={styles.divider} />

      <h3 className={styles.subtitle}>비밀번호 변경</h3>
      <form className={styles.form} onSubmit={handlePasswordChange}>
        <div className={styles.field}>
          <label className={styles.label}>현재 비밀번호</label>
          <input
            type="password"
            className={styles.input}
            value={pwForm.currentPassword}
            onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
            placeholder="현재 비밀번호"
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>새 비밀번호</label>
          <input
            type="password"
            className={styles.input}
            value={pwForm.newPassword}
            onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
            placeholder="새 비밀번호 (8자 이상)"
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>새 비밀번호 확인</label>
          <input
            type="password"
            className={styles.input}
            value={pwForm.confirmPassword}
            onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            placeholder="새 비밀번호 재입력"
            required
          />
        </div>
        {pwError && <p className={styles.error}>{pwError}</p>}
        {pwSuccess && <p className={styles.success}>비밀번호가 변경되었습니다.</p>}
        <Button type="submit" variant="outline" size="lg" style={{ alignSelf: 'flex-start' }} disabled={pwLoading}>
          {pwLoading ? '변경 중...' : '비밀번호 변경'}
        </Button>
      </form>
    </div>
  );
}
