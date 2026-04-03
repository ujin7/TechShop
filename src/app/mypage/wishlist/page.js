'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import ProductImageFallback from '@/components/product/ProductImageFallback';
import { formatPrice } from '@/utils/formatPrice';
import styles from './page.module.css';

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlist, toggle } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || wishlist.size === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }
    const ids = [...wishlist].join(',');
    fetch(`/api/products?ids=${ids}`)
      .then((r) => r.ok ? r.json() : { data: [] })
      .then(({ data }) => setProducts(data ?? []))
      .finally(() => setIsLoading(false));
  }, [user, wishlist]);

  const handleRemove = (productId) => toggle(productId);

  const handleAddToCart = (product) => {
    addToCart({ productId: product.id, name: product.name, price: product.price, thumbnail: product.thumbnail });
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>찜 목록</h2>

      {isLoading ? (
        <div style={{ color: 'var(--text-secondary)' }}>불러오는 중...</div>
      ) : products.length === 0 ? (
        <div className={styles.empty}>
          <Heart size={48} style={{ opacity: 0.2 }} />
          <p>찜한 상품이 없습니다.</p>
          <Link href="/" className={styles.shopLink}>쇼핑하러 가기</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.filter((p) => wishlist.has(p.id)).map((product) => (
            <div key={product.id} className={styles.card}>
              <Link href={`/products/${product.id}`} className={styles.imageWrap}>
                <ProductImageFallback category={product.category} size={48} />
              </Link>
              <div className={styles.info}>
                <p className={styles.brand}>{product.brand}</p>
                <Link href={`/products/${product.id}`} className={styles.name}>{product.name}</Link>
                <p className={styles.price}>{formatPrice(product.price)}</p>
                <div className={styles.actions}>
                  <button className={styles.cartBtn} onClick={() => handleAddToCart(product)}>
                    <ShoppingCart size={15} /> 장바구니
                  </button>
                  <button className={styles.removeBtn} onClick={() => handleRemove(product.id)}>
                    <Heart size={15} fill="currentColor" /> 해제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
