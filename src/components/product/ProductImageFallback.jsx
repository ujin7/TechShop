'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Smartphone, Laptop, Tablet, Monitor,
  Headphones, Package, Watch, Tv,
} from 'lucide-react';
import styles from './ProductImageFallback.module.css';

const CATEGORY_ICON = {
  smartphones:  Smartphone,
  laptops:      Laptop,
  tablets:      Tablet,
  monitors:     Monitor,
  audio:        Headphones,
  accessories:  Package,
  watches:      Watch,
  tv:           Tv,
};

const CATEGORY_GRADIENT = {
  smartphones: 'var(--fallback-smartphones)',
  laptops:     'var(--fallback-laptops)',
  tablets:     'var(--fallback-tablets)',
  monitors:    'var(--fallback-monitors)',
  audio:       'var(--fallback-audio)',
  accessories: 'var(--fallback-accessories)',
};

export default function ProductImageFallback({
  category = '',
  size = 48,
  src = '',
  alt = 'Product image',
}) {
  const [imgError, setImgError] = useState(false);
  const Icon = CATEGORY_ICON[category] || Package;
  const gradient = CATEGORY_GRADIENT[category] || 'var(--fallback-default)';

  if (src && !imgError) {
    return (
      <div className={styles.wrapper}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={styles.productImage}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={styles.wrapper} style={{ '--gradient': gradient }}>
      <div className={styles.inner}>
        <Icon size={size} className={styles.icon} strokeWidth={1.2} />
      </div>
    </div>
  );
}
