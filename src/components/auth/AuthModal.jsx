'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import styles from './AuthModal.module.css';

export default function AuthModal({
  isOpen = false,
  onClose,
  onLogin,
  onSignup,
  onGoogleLogin,
  isLoading = false,
  error = null,
}) {
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (activeTab === 'login') {
      onLogin?.(data);
    } else {
      onSignup?.(data);
    }
  };

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.isOpen : ''}`}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="닫기">
          <X size={20} />
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className={styles.subtitle}>
            {activeTab === 'login' ? '이메일 또는 Google 계정으로 로그인하세요.' : '간단한 정보로 빠르게 가입하세요.'}
          </p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'login' ? styles.active : ''}`}
            onClick={() => handleTabChange('login')}
          >
            로그인
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'signup' ? styles.active : ''}`}
            onClick={() => handleTabChange('signup')}
          >
            회원가입
          </button>
        </div>

        <div className={styles.socialSection}>
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={isLoading}
            className={styles.googleBtn}
            onClick={() => onGoogleLogin?.()}
          >
            Google로 계속하기
          </Button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} key={activeTab}>
          {activeTab === 'signup' && (
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="name">이름</label>
              <div className={styles.inputWrap}>
                <User size={18} className={styles.inputIcon} />
                <input
                  className={styles.input}
                  id="name"
                  name="name"
                  type="text"
                  placeholder="홍길동"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">이메일</label>
            <div className={styles.inputWrap}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                className={styles.input}
                id="email"
                name="email"
                type="email"
                placeholder="example@techshop.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">비밀번호</label>
            <div className={styles.inputWrap}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                className={styles.input}
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={isLoading}
                minLength={activeTab === 'signup' ? 8 : undefined}
              />
            </div>
            {activeTab === 'signup' && (
              <p className={styles.hint}>8자 이상 입력해주세요.</p>
            )}
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            style={{ marginTop: '4px' }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                처리 중...
              </span>
            ) : activeTab === 'login' ? '이메일 로그인' : '이메일 회원가입'}
          </Button>
        </form>
      </div>
    </div>
  );
}
