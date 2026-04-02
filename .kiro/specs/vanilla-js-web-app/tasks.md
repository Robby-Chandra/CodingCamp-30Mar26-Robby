# Implementation Plan: Vanilla JS Expense & Budget Visualizer

## Overview

Implement a single-page client-side expense tracker using plain HTML, CSS, and JavaScript. The app is built incrementally: project structure first, then core data logic, then UI rendering, then persistence, then the chart, and finally wiring everything together.

## Tasks

- [x] 1. Set up project structure and HTML skeleton
  - Create `index.html` with the full HTML structure: `<header>`, `<section#form-section>`, `<section#summary>` (containing `<div#balance>` and `<canvas#chart>`), and `<section#list-section>`
  - Create `css/style.css` with base layout, form styles, transaction list (with `overflow-y: auto` and fixed max-height), balance display, and category badge styles
  - Create `js/app.js` as an empty module with a `DOMContentLoaded` entry point
  - Add Chart.js CDN `<script>` tag to `index.html`
  - _Requirements: 6.1, 6.2, 6.5_

- [x] 2. Implement data model and localStorage persistence
  - [x] 2.1 Implement `loadFromStorage` and `saveToStorage` functions in `js/app.js`
    - `loadFromStorage`: reads `"vj-transactions"` from localStorage, parses JSON, returns array; catches parse errors and returns `[]`
    - `saveToStorage`: serialises the transactions array and writes to `"vj-transactions"`; wraps write in try/catch for unavailable storage
    - Initialise the in-memory `transactions` array by calling `loadFromStorage` on page load
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ] 2.2 Write property test for localStorage round-trip (Property 9)
    - // Feature: vanilla-js-web-app, Property 9: localStorage round-trip preserves all transactions
    - Use `fc.array(transactionArbitrary)` to verify serialise → deserialise produces a deeply equal array
    - **Property 9: localStorage round-trip**
    - **Validates: Requirements 5.1**

  - [ ] 2.3 Write property test for corrupt localStorage (Property 10)
    - // Feature: vanilla-js-web-app, Property 10: Corrupt localStorage initialises to empty list
    - Use `fc.string()` filtered to non-JSON strings; assert `loadFromStorage` returns `[]` without throwing
    - **Property 10: Corrupt localStorage → empty list**
    - **Validates: Requirements 5.3**

- [x] 3. Implement transaction add and delete logic
  - [x] 3.1 Implement `addTransaction(name, amount, category)` in `js/app.js`
    - Generate a unique `id` via `crypto.randomUUID()` (fallback: `Date.now().toString()`)
    - Push the new transaction object onto the `transactions` array
    - Call `saveToStorage()` then `render()`
    - _Requirements: 1.2, 5.2_

  - [x] 3.2 Implement `deleteTransaction(id)` in `js/app.js`
    - Filter `transactions` to remove the entry with the matching `id`
    - Call `saveToStorage()` then `render()`
    - _Requirements: 2.3, 5.2_

  - [ ]* 3.3 Write property test for valid transaction insertion round-trip (Property 1)
    - // Feature: vanilla-js-web-app, Property 1: Valid transaction insertion round-trip
    - Use `fc.string({minLength:1})`, `fc.float({min:0.01})`, `fc.constantFrom('Food','Transport','Fun')`
    - Assert transaction appears in in-memory array and in parsed localStorage value
    - **Property 1: Valid transaction insertion round-trip**
    - **Validates: Requirements 1.2, 5.2**

  - [ ]* 3.4 Write property test for delete removes from list and storage (Property 6)
    - // Feature: vanilla-js-web-app, Property 6: Delete removes transaction from list and storage
    - Use `fc.array(transactionArbitrary, {minLength:1})`; pick a random entry, delete it, assert it is absent from array and localStorage
    - **Property 6: Delete removes transaction from list and storage**
    - **Validates: Requirements 2.3, 5.2**

- [x] 4. Implement form validation
  - [x] 4.1 Implement `validateForm(name, amount, category)` in `js/app.js`
    - Returns `{valid: false, message: string}` when name (after trim) is empty, amount is non-positive or non-numeric, or category is missing
    - Returns `{valid: true}` otherwise
    - Wire the form `submit` event handler to call `validateForm`, show/hide the inline error `<p>`, and call `addTransaction` only on valid input; reset the form on success
    - _Requirements: 1.1, 1.3, 1.4, 1.5_

  - [ ]* 4.2 Write property test for empty-field submissions rejected (Property 2)
    - // Feature: vanilla-js-web-app, Property 2: Invalid inputs are rejected (empty fields)
    - Generate submissions with at least one blank field; assert `transactions` length is unchanged
    - **Property 2: Invalid inputs are rejected (empty fields)**
    - **Validates: Requirements 1.3**

  - [ ]* 4.3 Write property test for non-positive amount rejected (Property 3)
    - // Feature: vanilla-js-web-app, Property 3: Invalid inputs are rejected (non-positive amount)
    - Use `fc.float({max:0})` and non-numeric strings; assert `transactions` length is unchanged
    - **Property 3: Non-positive amount rejected**
    - **Validates: Requirements 1.4**

  - [ ]* 4.4 Write unit tests for validation edge cases
    - Test each individual missing field, amount = 0, amount = -1, amount = "abc"
    - _Requirements: 1.3, 1.4_

- [ ] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement UI rendering functions
  - [x] 6.1 Implement `renderList(transactions)` in `js/app.js`
    - Clear and repopulate `<section#list-section>`; each row shows name, formatted amount, category badge, and a delete button wired to `deleteTransaction(id)`
    - When array is empty, render a single "No transactions yet." message
    - _Requirements: 2.1, 2.2, 2.4_

  - [ ]* 6.2 Write property test for transaction list renders all stored transactions (Property 5)
    - // Feature: vanilla-js-web-app, Property 5: Transaction list renders all stored transactions
    - Use `fc.array(transactionArbitrary, {minLength:1})`; assert each transaction's name, formatted amount, and category appear in the rendered HTML
    - **Property 5: Transaction list renders all stored transactions**
    - **Validates: Requirements 2.1**

  - [x] 6.3 Implement `renderBalance(transactions)` in `js/app.js`
    - Compute sum of all `amount` fields; format as currency (e.g. `$0.00`); update `<div#balance>`
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 6.4 Write property test for balance equals sum (Property 7)
    - // Feature: vanilla-js-web-app, Property 7: Balance equals sum of all transaction amounts
    - Use `fc.array(transactionArbitrary)` including empty array; assert displayed value equals arithmetic sum formatted as currency
    - **Property 7: Balance equals sum**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**

  - [ ]* 6.5 Write property test for form resets after add (Property 4)
    - // Feature: vanilla-js-web-app, Property 4: Form resets after successful add
    - Use same arbitraries as P1; after `addTransaction`, assert all form fields are back to default empty/initial state
    - **Property 4: Form resets after add**
    - **Validates: Requirements 1.5**

- [x] 7. Implement chart rendering
  - [x] 7.1 Implement `buildChartData(transactions)` in `js/app.js`
    - Reduce transactions to per-category totals; return labels, data, and fixed colours (Food → green, Transport → blue, Fun → orange) for categories with a non-zero total only
    - _Requirements: 4.1, 4.4_

  - [x] 7.2 Implement `renderChart(transactions)` in `js/app.js`
    - Destroy any existing Chart.js instance stored in a module-level variable, then recreate a `'pie'` chart on `<canvas#chart>` using `buildChartData`
    - When `transactions` is empty, destroy the chart instance and show a placeholder message; hide the placeholder when transactions exist
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.5_

  - [ ]* 7.3 Write property test for chart data matches category totals (Property 8)
    - // Feature: vanilla-js-web-app, Property 8: Chart data matches category totals
    - Use `fc.array(transactionArbitrary)`; assert `buildChartData` returns exactly one entry per category with a non-zero total, and each value equals the sum of amounts for that category
    - **Property 8: Chart data matches category totals**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

  - [ ]* 7.4 Write unit tests for chart edge cases
    - Empty list → no chart data entries; single category → one segment; all three categories → three segments
    - _Requirements: 4.4, 4.5_

- [x] 8. Wire everything together with the top-level `render` function
  - [x] 8.1 Implement the top-level `render()` function in `js/app.js`
    - Calls `renderList(transactions)`, `renderBalance(transactions)`, and `renderChart(transactions)` in sequence
    - Call `render()` once on `DOMContentLoaded` after `loadFromStorage` to paint the initial state
    - _Requirements: 5.1, 3.2, 3.3, 4.2, 4.3_

  - [ ]* 8.2 Write unit tests for integration flows
    - Add then delete the same transaction → list is empty, localStorage is empty, balance shows `$0.00`
    - Add multiple transactions → balance and chart update correctly
    - _Requirements: 1.2, 2.3, 3.1, 5.2_

- [x] 9. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use **fast-check** (`npm install --save-dev fast-check`) with `numRuns: 100`
- Each property test file must include the comment tag `// Feature: vanilla-js-web-app, Property <N>: <text>`
- Unit tests and property tests live under `tests/unit/` and `tests/property/` respectively
