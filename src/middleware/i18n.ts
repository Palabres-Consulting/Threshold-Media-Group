import { NextRequest, NextResponse } from "next/server";
import { getTranslatedSlug } from "../app/lib/translateSlug"; // Adjust the import path

const locales = ["en", "fr"];
const defaultLocale = "en";


function getLocale(req: NextRequest) {
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;

  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  const accept = req.headers.get("accept-language");

  if (accept) {
    const matched = locales.find((locale) =>
      accept.toLowerCase().includes(locale),
    );

    if (matched) return matched;
  }

  return defaultLocale;
}

export function handleI18n(req: NextRequest, cookieDomain?: string) {
  const { pathname } = req.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  const currentLocale =
    locales.find((locale) => pathname.startsWith(`/${locale}`)) ||
    defaultLocale;

  if (hasLocale) {
    // FIX: If the user has a cookie with a different locale, redirect them,
    // BUT translate the URL slugs along the way so it doesn't 404!
    if (cookieLocale && cookieLocale !== currentLocale) {
      const segments = pathname.split("/");

      const translatedSegments = segments.map((segment, index) => {
        if (index < 2) return segment; // Skip "" and the locale string
        return getTranslatedSlug(segment, currentLocale, cookieLocale);
      });

      translatedSegments[1] = cookieLocale;
      const newPath = translatedSegments.join("/");

      const url = req.nextUrl.clone();
      url.pathname = newPath;
      return NextResponse.redirect(url);
    }

    const res = NextResponse.next();

    if (cookieLocale !== currentLocale) {
      const cookieOptions: { path: string; maxAge: number; domain?: string } = {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      };
      if (cookieDomain) {
        cookieOptions.domain = cookieDomain;
      }
      res.cookies.set("NEXT_LOCALE", currentLocale, cookieOptions);
    }

    return res;
  }

  // otherwise, add locale prefix once
  const locale = getLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  const res = NextResponse.redirect(url);
  const cookieOptions: {
    path: string;
    maxAge: number;
    secure: boolean;
    sameSite: "lax" | "strict" | "none";
    domain?: string;
  } = {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };
  if (cookieDomain) {
    cookieOptions.domain = cookieDomain;
  }
  res.cookies.set("NEXT_LOCALE", locale, cookieOptions);
  return res;
}
