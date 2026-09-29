import type { BusinessInfo, Quote } from '../types';

const QUOTES_KEY = 'snapquote.quotes';
const BUSINESS_KEY = 'snapquote.business';

export function loadQuotes(): Quote[] {
  try {
    return JSON.parse(localStorage.getItem(QUOTES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveQuotes(quotes: Quote[]) {
  localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
}

export function loadBusiness(): BusinessInfo {
  try {
    const raw = localStorage.getItem(BUSINESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { name: '', email: '', phone: '', address: '', license: '' };
}

export function saveBusiness(b: BusinessInfo) {
  localStorage.setItem(BUSINESS_KEY, JSON.stringify(b));
}
