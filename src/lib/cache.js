export function getCache(key) {
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    console.warn("Failed to read from localStorage:", e);
    return null;
  }
}

export function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Failed to write to localStorage:", e);
  }
}
