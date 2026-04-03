'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

const SIZE_CLASS = { sm: styles.sm, md: styles.md, lg: styles.lg, xl: styles.xl };

export default function Modal({ isOpen = false, onClose = () => {}, title = '', size = 'md', children }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handler);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className={`${styles.modal} ${SIZE_CLASS[size] ?? styles.md}`} role="dialog" aria-modal="true">
        {(title || true) && (
          <div className={styles.header}>
            {title && <h2 className={styles.title}>{title}</h2>}
            <button className={styles.closeBtn} onClick={onClose} aria-label="닫기">
              <X size={20} />
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  );
}
