import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Optimizes Cloudinary image URLs for performance by appending format and quality transformations.
 * Bypasses Next.js optimizer issues with large assets on mobile by letting Cloudinary handle it.
 * Falls back to original URL if not a Cloudinary image.
 */
export function optimizeCloudinaryUrl(src: string): string {
  if (!src.includes('res.cloudinary.com') || !src.includes('/image/upload/')) {
    return src;
  }
  // f_auto: auto-format (webp for modern browsers), q_auto: auto quality based on device
  return src.replace('/image/upload/', '/image/upload/f_auto,q_auto,w_1200/');
}

export function normalizeCategories(category: string | string[] | null | undefined): string[] {
  if (Array.isArray(category)) {
    return category.map((item) => item.trim()).filter(Boolean);
  }

  if (typeof category === 'string') {
    const value = category.trim();
    return value ? [value] : [];
  }

  return [];
}

export function formatCategories(category: string | string[] | null | undefined): string {
  return normalizeCategories(category).join(', ');
}

export function hasCategory(
  category: string | string[] | null | undefined,
  value: string,
): boolean {
  const target = value.trim().toLowerCase();
  if (!target) {
    return false;
  }

  return normalizeCategories(category).some(
    (item) => item.toLowerCase() === target,
  );
}

export function getPrimaryCategory(category: string | string[] | null | undefined): string {
  return normalizeCategories(category)[0] || '';
}
