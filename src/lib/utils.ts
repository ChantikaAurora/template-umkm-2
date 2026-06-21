import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').trim();
}

export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + '...' : str;
}
