// Storage utilities — extracted for testability

export const STORAGE_KEY = 'vj-transactions';

/**
 * Reads transactions from localStorage.
 * Returns an empty array if the key is absent or the value is not valid JSON.
 * @returns {Array}
 */
export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to parse transactions from localStorage:', e);
    return [];
  }
}

/**
 * Serialises the transactions array and writes it to localStorage.
 * Silently swallows errors when storage is unavailable.
 * @param {Array} transactions
 */
export function saveToStorage(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.warn('Failed to save transactions to localStorage:', e);
  }
}
