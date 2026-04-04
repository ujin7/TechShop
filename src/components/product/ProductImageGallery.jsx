'use client';

import { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import ProductImageFallback from './ProductImageFallback';
import styles from './ProductImageGallery.module.css';

export default function ProductImageGallery({
  category = '',
  productName = '',
  images = [],
}) {
  const [selected, setSelected] = useState(0);
  const galleryImages = images.length > 0 ? images : [''];
  const thumbCount = galleryImages.length;

  return (
    <div className={styles.gallery}>
      {thumbCount > 1 && (
        <div className={styles.thumbList}>
          {galleryImages.map((imageSrc, index) => (
            <button
              key={imageSrc || index}
              className={`${styles.thumbBtn} ${index === selected ? styles.thumbSelected : ''}`}
              onClick={() => setSelected(index)}
              aria-label={`이미지 ${index + 1}`}
            >
              <div className={styles.thumbImgWrap}>
                <ProductImageFallback
                  category={category}
                  size={24}
                  src={imageSrc}
                  alt={`${productName} ${index + 1}`}
                />
              </div>
            </button>
          ))}
        </div>
      )}

      <div className={styles.mainWrapper}>
        <ProductImageFallback
          category={category}
          size={120}
          src={galleryImages[selected]}
          alt={productName}
        />
        <div className={styles.zoomHint}>
          <ZoomIn size={18} />
        </div>
      </div>
    </div>
  );
}
