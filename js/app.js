// Expense & Budget Visualizer — app entry point

import { loadFromStorage, saveToStorage } from './storage.js';

let transactions = loadFromStorage();

/**
 * Adds a new transaction to the in-memory list, persists it, and re-renders.
 * @param {string} name
 * @param {number} amount
 * @param {string} category
 */
export function addTransaction(name, amount, category) {
  const id = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : Date.now().toString();
  transactions.push({ id, name, amount, category });
  saveToStorage(transactions);
  render();
}

/**
 * Removes the transaction with the given id, persists the change, and re-renders.
 * @param {string} id
 */
export function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveToStorage(transactions);
  render();
}

/**
 * Validates form input values.
 * @param {string} name
 * @param {string|number} amount
 * @param {string} category
 * @returns {{valid: boolean, message?: string}}
 */
export function validateForm(name, amount, category) {
  if (!name || name.trim() === '') {
    return { valid: false, message: 'Item name is required.' };
  }
  const numAmount = Number(amount);
  if (amount === '' || amount === null || amount === undefined || isNaN(numAmount) || numAmount <= 0) {
    return { valid: false, message: 'Amount must be a positive number.' };
  }
  if (!category || category === '') {
    return { valid: false, message: 'Please select a category.' };
  }
  return { valid: true };
}

/**
 * Renders the transaction list into #transaction-list.
 * @param {Array} txns
 */
export function renderList(txns) {
  const container = document.getElementById('transaction-list');
  if (!container) return;
  container.innerHTML = '';

  if (txns.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'empty-state';
    msg.textContent = 'No transactions yet.';
    container.appendChild(msg);
    return;
  }

  txns.forEach(t => {
    const row = document.createElement('div');
    row.className = 'transaction-row';
    row.dataset.id = t.id;

    const info = document.createElement('span');
    info.className = 'transaction-info';
    info.textContent = t.name;

    const badge = document.createElement('span');
    badge.className = `category-badge category-${t.category.toLowerCase()}`;
    badge.textContent = t.category;

    const amount = document.createElement('span');
    amount.className = 'transaction-amount';
    amount.textContent = formatCurrency(t.amount);

    const btn = document.createElement('button');
    btn.className = 'delete-btn';
    btn.textContent = 'Delete';
    btn.setAttribute('aria-label', `Delete ${t.name}`);
    btn.addEventListener('click', () => deleteTransaction(t.id));

    row.appendChild(info);
    row.appendChild(badge);
    row.appendChild(amount);
    row.appendChild(btn);
    container.appendChild(row);
  });
}

/**
 * Formats a number as a USD currency string.
 * @param {number} value
 * @returns {string}
 */
export function formatCurrency(value) {
  return '$' + Number(value).toFixed(2);
}

/**
 * Renders the total balance into #balance .balance-amount.
 * @param {Array} txns
 */
export function renderBalance(txns) {
  const el = document.querySelector('#balance .balance-amount');
  if (!el) return;
  const total = txns.reduce((sum, t) => sum + t.amount, 0);
  el.textContent = formatCurrency(total);
}

/** Module-level Chart.js instance, destroyed and recreated on each render. */
let chartInstance = null;

const CATEGORY_COLORS = {
  Food: 'rgba(34, 197, 94, 0.8)',
  Transport: 'rgba(59, 130, 246, 0.8)',
  Fun: 'rgba(249, 115, 22, 0.8)',
};

/**
 * Reduces transactions to per-category totals and returns Chart.js-ready data.
 * Only categories with a non-zero total are included.
 * @param {Array} txns
 * @returns {{labels: string[], data: number[], colors: string[]}}
 */
export function buildChartData(txns) {
  const totals = txns.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + t.amount;
    return acc;
  }, {});

  const labels = [];
  const data = [];
  const colors = [];

  for (const [cat, total] of Object.entries(totals)) {
    if (total > 0) {
      labels.push(cat);
      data.push(total);
      colors.push(CATEGORY_COLORS[cat] ?? 'rgba(156, 163, 175, 0.8)');
    }
  }

  return { labels, data, colors };
}

/**
 * Renders (or destroys) the Chart.js pie chart on <canvas#chart>.
 * Shows a placeholder when there are no transactions.
 * @param {Array} txns
 */
export function renderChart(txns) {
  const canvas = document.getElementById('chart');
  const placeholder = document.getElementById('chart-placeholder');

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  if (!txns.length) {
    if (canvas) canvas.style.display = 'none';
    if (placeholder) placeholder.hidden = false;
    return;
  }

  if (canvas) canvas.style.display = '';
  if (placeholder) placeholder.hidden = true;

  if (!canvas || typeof Chart === 'undefined') return;

  const { labels, data, colors } = buildChartData(txns);

  chartInstance = new Chart(canvas, {
    type: 'pie',
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
      },
    },
  });
}

/**
 * Top-level render — calls all rendering functions.
 */
function render() {
  renderList(transactions);
  renderBalance(transactions);
  renderChart(transactions);
}

if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', () => {
  render();

  const form = document.getElementById('transaction-form');
  const errorEl = document.getElementById('form-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements['name'].value;
    const amount = form.elements['amount'].value;
    const category = form.elements['category'].value;

    const result = validateForm(name, amount, category);
    if (!result.valid) {
      errorEl.textContent = result.message;
      errorEl.hidden = false;
      return;
    }

    errorEl.hidden = true;
    errorEl.textContent = '';
    addTransaction(name.trim(), Number(amount), category);
    form.reset();
  });
});
