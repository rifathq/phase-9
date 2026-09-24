/**
 * Formatting utilities for Zero Invest Marketplace
 * Primary Currency: Bangladeshi Taka (BDT / ৳)
 */

export function formatBDT(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '৳0';
  }
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `৳${Math.round(numeric).toLocaleString('en-US')}`;
}

export function formatDate(dateInput: string | number | Date | undefined | null): string {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString('en-US');
}
