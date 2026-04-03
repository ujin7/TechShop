'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

const SIZES = { sm: 14, md: 18, lg: 24 };

export default function StarRating({
  value = 0, max = 5, interactive = false,
  onChange = () => {}, size = 'md',
}) {
  const [hovered, setHovered] = useState(null);
  const px = SIZES[size] || 18;
  const display = hovered ?? value;

  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center', cursor: interactive ? 'pointer' : 'default' }}>
      {Array.from({ length: max }, (_, i) => {
        const full = display >= i + 1;
        const half = !full && display >= i + 0.5;
        return (
          <span
            key={i}
            style={{ position: 'relative', display: 'inline-flex', lineHeight: 0 }}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(null)}
            onClick={() => interactive && onChange(i + 1)}
          >
            {/* 빈 별 (배경) */}
            <Star size={px} color="var(--text-disabled)" fill="var(--text-disabled)" />
            {/* 채워진 별 (오버레이) */}
            {(full || half) && (
              <Star
                size={px}
                color="var(--color-star, #fbbf24)"
                fill="var(--color-star, #fbbf24)"
                style={{
                  position: 'absolute', top: 0, left: 0,
                  clipPath: half ? 'inset(0 50% 0 0)' : undefined,
                }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}
