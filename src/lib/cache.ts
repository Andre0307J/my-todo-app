export function getCache<T>(key: string): T | null {
  // localStorage is not available in server-side rendering environments
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const cached = localStorage.getItem(key);
    // Use a type assertion to tell TypeScript what type to expect
    return cached ? (JSON.parse(cached) as T) : null;
  } catch (e) {
    console.warn(`Failed to read from localStorage for key "${key}":`, e);
    return null;
  }
}

export function setCache<T>(key: string, data: T): void {
  // localStorage is not available in server-side rendering environments
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to write to localStorage for key "${key}":`, e);
  }
}
