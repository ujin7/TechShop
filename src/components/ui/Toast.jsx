'use client';

import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToastContext } from '@/context/ToastContext';

const TYPE_CONFIG = {
  success: { color: 'var(--color-success)', Icon: CheckCircle2 },
  error:   { color: 'var(--color-error)',   Icon: AlertCircle },
  warning: { color: 'var(--color-warning)', Icon: AlertTriangle },
  info:    { color: 'var(--color-accent)',  Icon: Info },
};

export default function Toast() {
  const { toasts, removeToast } = useToastContext();
  if (!toasts.length) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      zIndex: 'var(--z-toast)', display: 'flex',
      flexDirection: 'column', gap: 10,
      pointerEvents: 'none',
    }}>
      {toasts.map((toast) => {
        const { color, Icon } = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info;
        return (
          <div key={toast.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            minWidth: 280, maxWidth: 380,
            padding: '12px 16px',
            background: 'rgba(10, 14, 26, 0.92)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${color}55`,
            borderLeft: `3px solid ${color}`,
            borderRadius: 12,
            boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${color}22`,
            pointerEvents: 'all',
            animation: 'slideInRight 0.3s ease',
          }}>
            <Icon size={18} color={color} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--text-tertiary)',
                padding: 2, display: 'flex', alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
