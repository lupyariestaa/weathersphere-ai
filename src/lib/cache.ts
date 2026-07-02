/**
 * Tiny localStorage cache with expiration, used to avoid duplicate
 * network requests for weather data that hasn't gone stale yet.
 */
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const isBrowser = typeof window !== "undefined";

export function setCache<T>(key: string, value: T, ttlMs: number): void {
  if (!isBrowser) return;
  try {
    const entry: CacheEntry<T> = { value, expiresAt: Date.now() + ttlMs };
    window.localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    /* storage might be full or unavailable — fail silently, caching is an optimization, not a requirement */
  }
}

export function getCache<T>(key: string): T | null {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() > entry.expiresAt) {
      window.localStorage.removeItem(key);
      return null;
    }
    return entry.value;
  } catch {
    return null;
  }
}
