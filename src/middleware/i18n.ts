import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "fr"];
const defaultLocale = "en";

function getLocale(req: NextRequest) {
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  const accept = req.headers.get("accept-language");
  if (accept) {
    const matched = locales.find((locale) =>
      accept.toLowerCase().includes(locale)
    );
    if (matched) return matched;
  }

  return defaultLocale;
}

export function handleI18n(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Checking if path already has a valid locale prefix
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  const currentLocale =
    locales.find((locale) => pathname.startsWith(`/${locale}`)) ||
    defaultLocale;

  if (hasLocale) {
    // If the user has a cookie with a different locale, redirect them to their preferred locale.
    // This respects the user's explicit choice from the language switcher.
    if (cookieLocale && cookieLocale !== currentLocale) {
      const newPath = pathname.replace(`/${currentLocale}`, `/${cookieLocale}`);
      const url = req.nextUrl.clone();
      url.pathname = newPath;
      return NextResponse.redirect(url);
    }

    const res = NextResponse.next();

    // If the cookie is missing or doesn't match the path, update it.
    // This is useful if a user lands on a localized URL without a preference cookie.
    if (cookieLocale !== currentLocale) {
      res.cookies.set("NEXT_LOCALE", currentLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return res;
  }

  // otherwise, add locale prefix once
  const locale = getLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  const res = NextResponse.redirect(url);
  res.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
