import Link from 'next/link';
import {
  Smartphone, Laptop, Tablet, Monitor, Headphones, Package,
} from 'lucide-react';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import styles from './categories.module.css';

const ICON_MAP = { Smartphone, Laptop, Tablet, Monitor, Headphones, Package };

export const metadata = {
  title: '전체 카테고리 | TechShop',
};

export default function CategoriesPage() {
  return (
    <div className="app-container">
      <div className={styles.header}>
        <h1 className={styles.title}>전체 카테고리</h1>
        <p className={styles.subtitle}>원하는 카테고리를 선택하세요</p>
      </div>

      <div className={styles.grid}>
        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Package;
          const count = products.filter((p) => p.category === cat.id).length;

          return (
            <Link key={cat.id} href={`/categories/${cat.slug}`} className={styles.card}>
              <div className={styles.iconWrap} style={{ '--cat-color': cat.color }}>
                <Icon size={32} />
              </div>
              <div className={styles.info}>
                <h2 className={styles.catName}>{cat.name}</h2>
                <p className={styles.catDesc}>{cat.description}</p>
                <div className={styles.subcats}>
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/categories/${cat.slug}/${sub.slug}`}
                      className={styles.subTag}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
              <span className={styles.count}>{count}개</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
