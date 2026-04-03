/**
 * Cookie-session based fetch helper.
 * - Includes HttpOnly session cookie automatically.
 * - Keeps JSON ergonomics while allowing custom headers/options.
 */
export function fetchWithAuth(url, options = {}) {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers ?? {}),
  };

  return fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });
}
