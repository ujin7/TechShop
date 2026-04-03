const isBrowser = () => typeof window !== 'undefined';

export const lsGet = (key, fallback = null) => {
  if (!isBrowser()) return fallback;
  try {
    const val = window.localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

export const lsSet = (key, value) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 스토리지 초과 등 무시 */
  }
};

export const lsRemove = (key) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* 무시 */
  }
};

/* 최근 본 상품 관리 */
const RECENTLY_VIEWED_KEY = 'techshop_recently_viewed';
const MAX_RECENTLY_VIEWED = 10;

export const addRecentlyViewed = (productId) => {
  const list = lsGet(RECENTLY_VIEWED_KEY, []);
  const filtered = list.filter((id) => id !== productId);
  const updated = [productId, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
  lsSet(RECENTLY_VIEWED_KEY, updated);
};

export const getRecentlyViewed = () =>
  lsGet(RECENTLY_VIEWED_KEY, []);
