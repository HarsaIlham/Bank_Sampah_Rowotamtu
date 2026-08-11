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

// Map of local assets in src/assets
const assetModules = import.meta.glob<{ default: string }>('/src/assets/*', { eager: true });

/**
 * Resolves an image URL:
 * - If it's a remote URL (http/https/data/blob), returns it as-is.
 * - If it refers to a file in assets (e.g. '../assets/waste_bank.avif', 'waste_bank.avif', etc.),
 *   matches and returns the bundled Vite asset URL.
 */
export function resolveImageUrl(src?: string | null, fallback = ''): string {
  if (!src) return fallback;

  // Remote or data URLs
  if (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:') ||
    src.startsWith('blob:')
  ) {
    return src;
  }

  // Extract filename from relative path (e.g. '../assets/waste_bank.avif' -> 'waste_bank.avif')
  const filename = src.split('/').pop()?.split('?')[0]?.trim();
  if (filename) {
    for (const [path, module] of Object.entries(assetModules)) {
      if (path.endsWith(`/${filename}`)) {
        return module.default;
      }
    }
  }

  return src;
}
