'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Search, ShoppingCart, User, Cpu, Menu, X,
  ChevronDown, ChevronRight, LayoutDashboard, Package, LogOut,
  Smartphone, Laptop, Tablet, Monitor, Headphones, Package as PackageIcon,
} from 'lucide-react';
import styles from './Navbar.module.css';

const SearchOverlay = dynamic(() => import('./SearchOverlay'), { ssr: false });

const ICON_MAP = {
  Smartphone, Laptop, Tablet, Monitor, Headphones, Package: PackageIcon,
};

export default function Navbar({
  categories = [],
  cartItemCount = 0,
  onOpenCart = () => {},
  onOpenAuth = () => {},
  user = null,
  onLogout = () => {},
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const userMenuRef = useRef(null);
  const navRef = useRef(null);
  const closeTimer = useRef(null);

  /* 모바일 메뉴 열릴 때 스크롤 잠금 */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setMobileExpandedCat(null);
  }, []);

  /* 유저 메뉴 바깥 클릭 시 닫기 */
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userMenuOpen]);

  const handleCategoryEnter = (slug) => {
    clearTimeout(closeTimer.current);
    setActiveCategory(slug);
  };

  const handleCategoryLeave = () => {
    closeTimer.current = setTimeout(() => setActiveCategory(null), 150);
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    onLogout();
  };

  const forceGoHome = useCallback((e) => {
    e.preventDefault();
    window.location.assign('/');
  }, []);

  return (
    <>
      <header className={styles.navbar}>
        <div className={`app-container ${styles.navContainer}`}>

          {/* Logo */}
          <Link href="/" className={styles.logo} onClick={forceGoHome}>
            <Cpu className={styles.logoIcon} size={28} />
            <span>TECH<span className="text-gradient-cyan">SHOP</span></span>
          </Link>

          {/* Category Nav */}
          <nav className={styles.navLinks} ref={navRef}>
            {categories.map((cat) => {
              const Icon = ICON_MAP[cat.icon] || PackageIcon;
              const isOpen = activeCategory === cat.slug;
              return (
                <div
                  key={cat.slug}
                  className={styles.catItem}
                  onMouseEnter={() => handleCategoryEnter(cat.slug)}
                  onMouseLeave={handleCategoryLeave}
                >
                  <Link
                    href={`/categories/${cat.slug}`}
                    className={`${styles.navLink} ${isOpen ? styles.navLinkActive : ''}`}
                    onClick={() => setActiveCategory(null)}
                  >
                    {cat.name}
                    {cat.subcategories?.length > 0 && (
                      <ChevronDown size={12} className={`${styles.catChevron} ${isOpen ? styles.catChevronOpen : ''}`} />
                    )}
                  </Link>

                  {isOpen && cat.subcategories?.length > 0 && (
                    <div className={styles.dropdown}
                      onMouseEnter={() => handleCategoryEnter(cat.slug)}
                      onMouseLeave={handleCategoryLeave}
                    >
                      <div className={styles.dropdownInner}>
                        <div className={styles.dropdownHead} style={{ '--cat-color': cat.color }}>
                          <Icon size={18} />
                          <span>{cat.name}</span>
                        </div>
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/categories/${cat.slug}/${sub.slug}`}
                            className={styles.subItem}
                            onClick={() => setActiveCategory(null)}
                          >
                            <span className={styles.subName}>{sub.name}</span>
                            <span className={styles.subDesc}>{sub.description}</span>
                          </Link>
                        ))}
                        <Link
                          href={`/categories/${cat.slug}`}
                          className={styles.viewAllSub}
                          onClick={() => setActiveCategory(null)}
                        >
                          전체 보기 →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <Link href="/compare" className={styles.navLink}>비교</Link>
          </nav>

          {/* Right Actions */}
          <div className={styles.actions}>
            <button className={styles.iconBtn} aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search size={22} />
            </button>

            {user ? (
              <div className={styles.userMenu} ref={userMenuRef}>
                <button
                  className={`${styles.userBtn} ${userMenuOpen ? styles.userBtnOpen : ''}`}
                  onClick={() => setUserMenuOpen((v) => !v)}
                >
                  <div className={styles.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
                  <span className={styles.userName}>{user.name}</span>
                  <ChevronDown size={14} className={`${styles.chevron} ${userMenuOpen ? styles.chevronOpen : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className={styles.userDropdown}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownAvatar}>{user.name?.charAt(0).toUpperCase()}</div>
                      <div>
                        <p className={styles.dropdownName}>{user.name}</p>
                        <p className={styles.dropdownEmail}>{user.email}</p>
                      </div>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <Link href="/mypage" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard size={15} /> 마이페이지
                    </Link>
                    <Link href="/mypage/orders" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                      <Package size={15} /> 주문 내역
                    </Link>
                    <div className={styles.dropdownDivider} />
                    <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout}>
                      <LogOut size={15} /> 로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className={styles.iconBtn} aria-label="로그인" onClick={onOpenAuth}>
                <User size={22} />
              </button>
            )}

            <button className={styles.iconBtn} aria-label="Cart" onClick={onOpenCart}>
              <ShoppingCart size={22} />
              {cartItemCount > 0 && <span className={styles.cartBadge}>{cartItemCount}</span>}
            </button>

            {/* 햄버거 버튼 — 모바일만 표시 */}
            <button
              className={`${styles.iconBtn} ${styles.hamburger}`}
              aria-label="메뉴"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </header>

      {/* 모바일 드로어 */}
      {mobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={closeMobileMenu}>
          <nav className={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileHeader}>
              <Link
                href="/"
                className={styles.logo}
                onClick={(e) => {
                  closeMobileMenu();
                  forceGoHome(e);
                }}
              >
                <Cpu size={22} />
                <span>TECH<span className="text-gradient-cyan">SHOP</span></span>
              </Link>
              <button className={styles.iconBtn} onClick={closeMobileMenu} aria-label="닫기">
                <X size={22} />
              </button>
            </div>

            <div className={styles.mobileNav}>
              {categories.map((cat) => {
                const Icon = ICON_MAP[cat.icon] || PackageIcon;
                const expanded = mobileExpandedCat === cat.slug;
                return (
                  <div key={cat.slug} className={styles.mobileCatGroup}>
                    <div className={styles.mobileCatRow}>
                      <Link
                        href={`/categories/${cat.slug}`}
                        className={styles.mobileCatLink}
                        onClick={closeMobileMenu}
                      >
                        <Icon size={16} />
                        {cat.name}
                      </Link>
                      {cat.subcategories?.length > 0 && (
                        <button
                          className={styles.mobileExpandBtn}
                          onClick={() => setMobileExpandedCat(expanded ? null : cat.slug)}
                          aria-label="펼치기"
                        >
                          <ChevronRight size={16} className={`${styles.mobileChevron} ${expanded ? styles.mobileChevronOpen : ''}`} />
                        </button>
                      )}
                    </div>
                    {expanded && cat.subcategories?.length > 0 && (
                      <div className={styles.mobileSubList}>
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/categories/${cat.slug}/${sub.slug}`}
                            className={styles.mobileSubLink}
                            onClick={closeMobileMenu}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <Link href="/compare" className={styles.mobileCatLink} onClick={closeMobileMenu}>
                비교
              </Link>
            </div>

            <div className={styles.mobileDivider} />

            {user ? (
              <div className={styles.mobileUser}>
                <div className={styles.mobileUserInfo}>
                  <div className={styles.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className={styles.dropdownName}>{user.name}</p>
                    <p className={styles.dropdownEmail}>{user.email}</p>
                  </div>
                </div>
                <Link href="/mypage" className={styles.mobileUserLink} onClick={closeMobileMenu}>
                  <LayoutDashboard size={15} /> 마이페이지
                </Link>
                <Link href="/mypage/orders" className={styles.mobileUserLink} onClick={closeMobileMenu}>
                  <Package size={15} /> 주문 내역
                </Link>
                <button className={`${styles.mobileUserLink} ${styles.mobileLogout}`} onClick={() => { handleLogout(); closeMobileMenu(); }}>
                  <LogOut size={15} /> 로그아웃
                </button>
              </div>
            ) : (
              <button className={styles.mobileLoginBtn} onClick={() => { onOpenAuth(); closeMobileMenu(); }}>
                <User size={16} /> 로그인 / 회원가입
              </button>
            )}
          </nav>
        </div>
      )}

      {searchOpen && <SearchOverlay onClose={closeSearch} />}
    </>
  );
}
