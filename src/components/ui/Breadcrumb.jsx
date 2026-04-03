'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav
      aria-label="breadcrumb"
      style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const href = item.href || (index === 0 ? '/' : null);

        return (
          <span key={`${item.label}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {index > 0 && <ChevronRight size={13} color="var(--text-disabled)" />}
            {!isLast && href ? (
              <Link
                href={href}
                style={{
                  fontSize: '0.83rem',
                  color: 'var(--text-tertiary)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                style={{
                  fontSize: '0.83rem',
                  color: isLast ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                }}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
