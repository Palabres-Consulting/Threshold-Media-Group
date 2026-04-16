import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Determines the base domain suitable for setting a cross-subdomain cookie.
 * For 'localhost', it returns an empty string (omit domain).
 * For 'sub.example.com' or 'example.com', it returns '.example.com'.
 */
export function getBaseDomainForCookie(host: string): string {
  // Remove port if present (e.g., 'localhost:3000' -> 'localhost')
  const hostWithoutPort = host.split(':')[0];

  // Handle localhost specifically for development environments
  if (hostWithoutPort.toLowerCase().includes('localhost')) {
    return ''; // Omit domain for localhost
  }

  // For production domains, construct the root domain with a leading dot
  // to make it accessible across all subdomains.
  const parts = hostWithoutPort.split('.');
  return `.${parts.slice(parts.length - 2).join('.')}`;
}



// lib/constants.ts or similar
export const SITE_TO_POST_TYPE = {
  main: "posts",
  extraction: "extraction",
  asint: "asint",
  guinea_intel: "guinea_intels", // Note the 's'
  innovation: "innovation",
  transverse: "transverse",
} as const;

export type SiteName = keyof typeof SITE_TO_POST_TYPE;
export type WPPostType = (typeof SITE_TO_POST_TYPE)[SiteName];


export const socialLinks = {
  x: "https://x.com/thresholdmediag?s=21",
  linkedin: "https://www.linkedin.com/company/threshold-media-group-guin%C3%A9e/",
  facebook: "https://www.facebook.com/share/1cE3bqj4Sw/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/thre.sholdmediagroup_guinea?igsh=MTh2MXNlM3N3cmIwZA==",
  youtube: "https://www.youtube.com/@ThresholdMediagroup",
  tiktok: "https://www.tiktok.com/@thresholdmediagroup?"

};