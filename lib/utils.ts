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
