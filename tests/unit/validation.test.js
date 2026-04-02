import { describe, it, expect } from 'vitest';
import { validateForm } from '../../js/app.js';

describe('validateForm', () => {
  // Valid input
  it('returns valid for correct inputs', () => {
    expect(validateForm('Groceries', 12.5, 'Food')).toEqual({ valid: true });
  });

  // Name validation
  it('rejects empty name', () => {
    const result = validateForm('', 10, 'Food');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Item name is required.');
  });

  it('rejects whitespace-only name', () => {
    const result = validateForm('   ', 10, 'Food');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Item name is required.');
  });

  // Amount validation
  it('rejects zero amount', () => {
    const result = validateForm('Bus', 0, 'Transport');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Amount must be a positive number.');
  });

  it('rejects negative amount', () => {
    const result = validateForm('Bus', -5, 'Transport');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Amount must be a positive number.');
  });

  it('rejects non-numeric amount string', () => {
    const result = validateForm('Bus', 'abc', 'Transport');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Amount must be a positive number.');
  });

  it('rejects empty amount string', () => {
    const result = validateForm('Bus', '', 'Transport');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Amount must be a positive number.');
  });

  // Category validation
  it('rejects missing category', () => {
    const result = validateForm('Movie', 15, '');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Please select a category.');
  });

  it('rejects undefined category', () => {
    const result = validateForm('Movie', 15, undefined);
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Please select a category.');
  });

  // Name is checked first
  it('reports name error before amount error', () => {
    const result = validateForm('', -1, '');
    expect(result.message).toBe('Item name is required.');
  });

  // Amount checked before category
  it('reports amount error before category error', () => {
    const result = validateForm('Item', 0, '');
    expect(result.message).toBe('Amount must be a positive number.');
  });
});
