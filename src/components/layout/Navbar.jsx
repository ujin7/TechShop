'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Search,
  ShoppingCart,
  User,
  Cpu,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Package,
  LogOut,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Headphones,
  Package as PackageIcon,
} from 'lucide-react';
import styles from './Navbar.module.css';

const SearchOverlay = dynamic(() => import('./SearchOverlay'), { ssr: false });

const ICON_MAP = {
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Headphones,
  Package: PackageIcon,
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
  const userMenuRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!userMenuOpen) return undefined;

    const handleOutsideClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [userMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileExpandedCat(null);
  };

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

  const forceGoHome = (event) => {
    event.preventDefault();
    window.location.assign('/');
  };

  return (
    <>
      <header className={styles.navbar}>
        <div className={`app-container ${styles.navContainer}`}>
          <Link href="/" className={styles.logo} onClick={forceGoHome} aria-label="TechShop 홈으로 이동">
            <Cpu className={styles.logoIcon} size={28} />
            <span>
              TECH<span className="text-gradient-cyan">SHOP</span>
            </span>
          </Link>

          <nav className={styles.navLinks}>
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
                      <ChevronDown
                        size={12}
                        className={`${styles.catChevron} ${isOpen ? styles.catChevronOpen : ''}`}
                      />
                    )}
                  </Link>

                  {isOpen && cat.subcategories?.length > 0 && (
                    <div
                      className={styles.dropdown}
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
                          전체 보기
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <Link href="/compare" className={styles.navLink}>
              비교
            </Link>
          </nav>

          <div className={styles.actions}>
            <button className={styles.iconBtn} aria-label="검색 열기" onClick={() => setSearchOpen(true)}>
              <Search size={22} />
            </button>

            {user ? (
              <div className={styles.userMenu} ref={userMenuRef}>
                <button
                  className={`${styles.userBtn} ${userMenuOpen ? styles.userBtnOpen : ''}`}
                  onClick={() => setUserMenuOpen((value) => !value)}
                  aria-label="사용자 메뉴 열기"
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
                      <LayoutDashboard size={15} />
                      마이페이지
                    </Link>
                    <Link href="/mypage/orders" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                      <Package size={15} />
                      주문 내역
                    </Link>

                    <div className={styles.dropdownDivider} />

                    <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout}>
                      <LogOut size={15} />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className={styles.iconBtn} aria-label="로그인 열기" onClick={onOpenAuth}>
                <User size={22} />
              </button>
            )}

            <button className={styles.iconBtn} aria-label="장바구니 열기" onClick={onOpenCart}>
              <ShoppingCart size={22} />
              {cartItemCount > 0 && <span className={styles.cartBadge}>{cartItemCount}</span>}
            </button>

            <button
              className={`${styles.iconBtn} ${styles.hamburger}`}
              aria-label="모바일 메뉴 열기"
              onClick={() => setMobileMenuOpen((value) => !value)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={closeMobileMenu}>
          <nav className={styles.mobileDrawer} onClick={(event) => event.stopPropagation()}>
            <div className={styles.mobileHeader}>
              <Link
                href="/"
                className={styles.logo}
                onClick={(event) => {
                  closeMobileMenu();
                  forceGoHome(event);
                }}
              >
                <Cpu size={22} />
                <span>
                  TECH<span className="text-gradient-cyan">SHOP</span>
                </span>
              </Link>
              <button className={styles.iconBtn} onClick={closeMobileMenu} aria-label="메뉴 닫기">
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
                          aria-label={`${cat.name} 하위 카테고리 열기`}
                        >
                          <ChevronRight
                            size={16}
                            className={`${styles.mobileChevron} ${expanded ? styles.mobileChevronOpen : ''}`}
                          />
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
                  <LayoutDashboard size={15} />
                  마이페이지
                </Link>
                <Link href="/mypage/orders" className={styles.mobileUserLink} onClick={closeMobileMenu}>
                  <Package size={15} />
                  주문 내역
                </Link>
                <button
                  className={`${styles.mobileUserLink} ${styles.mobileLogout}`}
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                >
                  <LogOut size={15} />
                  로그아웃
                </button>
              </div>
            ) : (
              <button className={styles.mobileLoginBtn} onClick={() => { onOpenAuth(); closeMobileMenu(); }}>
                <User size={16} />
                로그인 / 회원가입
              </button>
            )}
          </nav>
        </div>
      )}

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
