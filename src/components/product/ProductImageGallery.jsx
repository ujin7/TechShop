'use client';

import { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import ProductImageFallback from './ProductImageFallback';
import styles from './ProductImageGallery.module.css';

export default function ProductImageGallery({ category = '', productName: _productName = '', count = 1 }) {
  const [selected, setSelected] = useState(0);
  const thumbCount = Math.max(1, count);

  return (
    <div className={styles.gallery}>
      {/* 썸네일 목록 */}
      {thumbCount > 1 && (
        <div className={styles.thumbList}>
          {Array.from({ length: thumbCount }, (_, i) => (
            <button
              key={i}
              className={`${styles.thumbBtn} ${i === selected ? styles.thumbSelected : ''}`}
              onClick={() => setSelected(i)}
              aria-label={`이미지 ${i + 1}`}
            >
              <div className={styles.thumbImgWrap}>
                <ProductImageFallback category={category} size={24} />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 메인 이미지 */}
      <div className={styles.mainWrapper}>
        <ProductImageFallback category={category} size={120} />
        <div className={styles.zoomHint}>
          <ZoomIn size={18} />
        </div>
      </div>
    </div>
  );
}
