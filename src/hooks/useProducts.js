'use client';

import { useEffect, useRef, useState } from 'react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

/**
 * 클라이언트 사이드에서 /api/products를 fetch합니다.
 * 서버 컴포넌트(page.js)에서는 직접 data/*.js를 import하거나 fetch를 사용하세요.
 *
 * @param {string} query - URLSearchParams 형태의 쿼리 문자열
 * @param {object} options
 * @param {boolean} options.skip - true이면 fetch 생략
 */
export function useProducts(query = '', { skip = false } = {}) {
  const [data, setData]         = useState([]);
  const [total, setTotal]       = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [meta, setMeta]         = useState(null);   // { brands, priceRange }
  const [isLoading, setIsLoading] = useState(!skip);
  const [error, setError]       = useState(null);
  const abortRef                = useRef(null);

  useEffect(() => {
    if (skip) return;

    /* 이전 요청 취소 */
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    fetch(`/api/products${query ? '?' + query : ''}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(({ data: products, total: t, totalPages: tp, meta: m }) => {
        setData(products);
        setTotal(t);
        setTotalPages(tp);
        setMeta(m);
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setError(e.message);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [query, skip]);

  return { data, total, totalPages, meta, isLoading, error };
}

/**
 * 단일 상품 + 리뷰를 함께 fetch합니다.
 * @param {string} productId
 */
export function useProductDetail(productId) {
  const [product, setProduct]   = useState(null);
  const [related, setRelated]   = useState([]);
  const [reviews, setReviews]   = useState([]);
  const [reviewMeta, setReviewMeta] = useState({ avgRating: 0, ratingDist: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!productId) return;
    setIsLoading(true);
    setError(null);

    Promise.all([
      fetch(`/api/products/${productId}`).then((r) => r.ok ? r.json() : Promise.reject(r.status)),
      fetch(`/api/reviews?productId=${productId}&limit=20`).then((r) => r.ok ? r.json() : { data: [], avgRating: 0, ratingDist: [], total: 0 }),
    ])
      .then(([productJson, reviewJson]) => {
        setProduct(productJson.data);
        setRelated(productJson.related ?? []);
        setReviews(reviewJson.data ?? []);
        setReviewMeta({
          avgRating:  reviewJson.avgRating ?? 0,
          ratingDist: reviewJson.ratingDist ?? [],
          total:      reviewJson.total ?? 0,
        });
      })
      .catch((e) => setError(String(e)))
      .finally(() => setIsLoading(false));
  }, [productId]);

  /** 낙관적 리뷰 추가: 서버 응답 전에 UI 반영 */
  const addReviewOptimistic = async (reviewData) => {
    const optimistic = { ...reviewData, id: `tmp_${Date.now()}`, createdAt: new Date().toISOString(), helpful: 0, images: [] };
    setReviews((prev) => [optimistic, ...prev]);

    const res = await fetchWithAuth('/api/reviews', {
      method: 'POST',
      body:   JSON.stringify(reviewData),
    });

    if (res.ok) {
      const { data: saved } = await res.json();
      /* 임시 항목을 서버 항목으로 교체 */
      setReviews((prev) => prev.map((r) => (r.id === optimistic.id ? saved : r)));
      return { success: true };
    } else {
      /* 실패 시 낙관적 항목 제거 */
      setReviews((prev) => prev.filter((r) => r.id !== optimistic.id));
      return { success: false };
    }
  };

  return { product, related, reviews, reviewMeta, isLoading, error, addReviewOptimistic };
}
