import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

dayjs.extend(relativeTime);
dayjs.locale('id');

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatWeight(kg: number): string {
  return `${kg.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} kg`;
}

export function formatDate(dateString: string): string {
  return dayjs(dateString).format('D MMMM YYYY');
}

export function formatDateTime(dateString: string): string {
  return dayjs(dateString).format('D MMM YYYY, HH:mm');
}

export function formatRelativeTime(dateString: string): string {
  return dayjs(dateString).fromNow();
}
