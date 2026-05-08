"use client";

export function setLocaleCookie(locale: string) {
  if (typeof document === "undefined") return;
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${
    60 * 60 * 24 * 365
  }`;
}
