// Feature: vanilla-js-web-app, Property 9: localStorage round-trip preserves all transactions

import { describe, it, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { loadFromStorage, saveToStorage, STORAGE_KEY } from '../../js/storage.js';

// Minimal localStorage mock for the test environment
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

globalThis.localStorage = localStorageMock;

// Arbitrary for a single valid transaction
const transactionArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 36 }),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  amount: fc.float({ min: Math.fround(0.01), max: Math.fround(100000), noNaN: true }),
  category: fc.constantFrom('Food', 'Transport', 'Fun'),
});

describe('Property 9: localStorage round-trip preserves all transactions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('serialise → deserialise produces a deeply equal array', () => {
    fc.assert(
      fc.property(fc.array(transactionArbitrary), (original) => {
        saveToStorage(original);
        const restored = loadFromStorage();

        // Same length
        if (restored.length !== original.length) return false;

        // Deep equality on each transaction
        for (let i = 0; i < original.length; i++) {
          const o = original[i];
          const r = restored[i];
          if (
            r.id !== o.id ||
            r.name !== o.name ||
            r.category !== o.category ||
            Math.abs(r.amount - o.amount) > Number.EPSILON
          ) {
            return false;
          }
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: vanilla-js-web-app, Property 10: Corrupt localStorage initialises to empty list
describe('Property 10: Corrupt localStorage → empty list', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns [] without throwing for any non-JSON string', () => {
    // Filter out strings that happen to be valid JSON
    const nonJsonString = fc.string().filter((s) => {
      try { JSON.parse(s); return false; } catch { return true; }
    });

    fc.assert(
      fc.property(nonJsonString, (corrupt) => {
        localStorage.setItem(STORAGE_KEY, corrupt);
        const result = loadFromStorage();
        return Array.isArray(result) && result.length === 0;
      }),
      { numRuns: 100 }
    );
  });
});
