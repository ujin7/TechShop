import Link from 'next/link';
import {
  Smartphone, Laptop, Tablet, Monitor, Headphones, Package,
} from 'lucide-react';
import styles from './CategoryShowcase.module.css';

const ICON_MAP = {
  Smartphone, Laptop, Tablet, Monitor, Headphones, Package,
};

export default function CategoryShowcase({ categories = [] }) {
  if (!categories.length) return null;

  return (
    <section className={styles.section}>
      <div className="app-container">
        <h2 className={styles.heading}>카테고리</h2>
        <div className={styles.grid}>
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Package;
            return (
              <Link key={cat.id} href={`/categories/${cat.slug}`} className={styles.card}>
                <div
                  className={styles.iconWrap}
                  style={{ '--cat-color': cat.color }}
                >
                  <Icon size={28} />
                </div>
                <span className={styles.name}>{cat.name}</span>
                {cat.productCount != null && (
                  <span className={styles.count}>{cat.productCount}개 상품</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
