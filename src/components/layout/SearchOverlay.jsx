'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react';
import styles from './SearchOverlay.module.css';

const POPULAR = [
  { label: 'Galaxy S25 Ultra', href: '/products/s25-ultra' },
  { label: 'MacBook Pro M4', href: '/products/macbook-pro-16-m4-max' },
  { label: 'AirPods Pro', href: '/products/airpods-pro-2' },
  { label: '게이밍 모니터', href: '/categories/monitors/gaming-monitor' },
  { label: '기계식 키보드', href: '/categories/accessories/peripherals' },
];

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchOverlay({ onClose }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
  const abortRef = useRef(null);

  /* 오버레이 열리면 입력창 포커스 */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* Escape 키로 닫기 */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  /* 스크롤 잠금 */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* 실시간 검색 */
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setIsLoading(true);
    fetch(`/api/products?q=${encodeURIComponent(debouncedQuery)}&limit=6`, { signal: ctrl.signal })
      .then((r) => r.ok ? r.json() : null)
      .then((json) => json && setResults(json.data ?? []))
      .catch(() => {})
      .finally(() => setIsLoading(false));

    return () => ctrl.abort();
  }, [debouncedQuery]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose();
  }, [query, router, onClose]);

  const handleResultClick = useCallback(() => onClose(), [onClose]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>

        {/* 입력창 */}
        <form className={styles.inputRow} onSubmit={handleSubmit}>
          <Search size={22} className={styles.searchIcon} />
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            placeholder="상품명, 브랜드, 카테고리 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              aria-label="지우기"
            >
              <X size={18} />
            </button>
          )}
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">
            <X size={22} />
          </button>
        </form>

        <div className={styles.divider} />

        {/* 결과 영역 */}
        <div className={styles.body}>
          {!query.trim() ? (
            <div className={styles.popular}>
              <p className={styles.sectionTitle}>
                <TrendingUp size={14} /> 인기 검색
              </p>
              <div className={styles.popularList}>
                {POPULAR.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={styles.popularItem}
                    onClick={handleResultClick}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : isLoading ? (
            <div className={styles.status}>검색 중...</div>
          ) : results.length === 0 ? (
            <div className={styles.status}>&ldquo;{query}&rdquo;에 대한 결과가 없습니다.</div>
          ) : (
            <>
              <p className={styles.sectionTitle}>검색 결과</p>
              <ul className={styles.resultList}>
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/products/${p.id}`}
                      className={styles.resultItem}
                      onClick={handleResultClick}
                    >
                      <div className={styles.thumb}>
                        <Image
                          src={p.thumbnail || p.images?.[0] || EMPTY_IMAGE}
                          alt={p.name}
                          fill
                          sizes="56px"
                          style={{ objectFit: 'contain' }}
                          unoptimized
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = EMPTY_IMAGE;
                          }}
                        />
                      </div>
                      <div className={styles.resultInfo}>
                        <span className={styles.resultBrand}>{p.brand}</span>
                        <span className={styles.resultName}>{p.name}</span>
                        <span className={styles.resultPrice}>
                          {p.price?.toLocaleString('ko-KR')}원
                        </span>
                      </div>
                      <ArrowRight size={16} className={styles.resultArrow} />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className={styles.viewAll}
                onClick={handleResultClick}
              >
                &ldquo;{query}&rdquo; 전체 결과 보기 <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
