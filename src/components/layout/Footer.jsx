import { Cpu } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="app-container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <Cpu size={24} className="text-gradient-cyan" />
              <span>
                TECH<span className="text-gradient-cyan">SHOP</span>
              </span>
            </div>
            <p className={styles.desc}>
              프리미엄 IT 디바이스를 더 쉽고 감각적으로 탐색하는
              <br />
              TechShop의 쇼핑 경험을 만나보세요.
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 TechShop. All rights reserved.</p>
          <p>Curated shopping experience for modern tech.</p>
        </div>
      </div>
    </footer>
  );
}
