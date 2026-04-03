import { Cpu } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`app-container`}>
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <Cpu size={24} className="text-gradient-cyan" />
              <span>TECH<span className="text-gradient-cyan">SHOP</span></span>
            </div>
            <p className={styles.desc}>
              2026 프리미엄 IT 디바이스 전문 쇼핑몰. <br />최고의 기술을 가장 먼저 경험하세요.
            </p>
          </div>

        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p>© 2026 TechShop. All rights reserved.</p>
          <p>Designed by Antigravity & Logic by Claude Code.</p>
        </div>
      </div>
    </footer>
  );
}
