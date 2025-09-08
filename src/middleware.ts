import { NextResponse, type NextRequest } from "next/server";

// ------------------- CONFIG -------------------
const locales = ["en", "fr"];
const defaultLocale = "en";

// ------------------- HELPERS -------------------

// Detect locale from cookie or browser header
function getLocale(req: NextRequest): string {
  //  Check cookie
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  //  Check Accept-Language header
  const acceptLang = req.headers.get("accept-language") || "";
  const languages = acceptLang.split(",").map((l) => l.split(";")[0]);

  // Match only the primary language part (before "-"), e.g. "en-US" → "en"
  const matched = languages
    .map((lang) => lang.split("-")[0])
    .find((lang) => locales.includes(lang));

  if (matched) return matched;

  //  Fallback
  return defaultLocale;
}

// Extract subdomain from host
function getSubdomain(host: string): string {
  const parts = host.split(".");
  if (parts.length > 2) return parts[0]; // e.g. "extraction"
  return "main"; // fallback
}

// ------------------- MIDDLEWARE -------------------
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // ------------------- SKIP INTERNAL PATHS -------------------
  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // ------------------- SITE DETECTION -------------------
  let host = url.host;
  const siteParam = url.searchParams.get("site");
  if (process.env.NODE_ENV === "development" && siteParam) {
    host = `${siteParam}.localhost:3000`;
  }

  const cookieSite = req.cookies.get("site")?.value;
  const resolvedSite = siteParam || cookieSite || getSubdomain(host);

  // Set site cookie for future requests
  const response = NextResponse.next();
  response.cookies.set("site", resolvedSite, { path: "/" });

  // ------------------- LOCALE DETECTION -------------------
  const pathnameHasLocale = locales.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(req);
    url.pathname = `/${locale}${pathname}`;

    // Set locale cookie
    response.cookies.set("NEXT_LOCALE", locale, { path: "/" });

    // Redirect browser to URL with locale prefix
    return NextResponse.redirect(url);
  }

  // ------------------- AUTH PLACEHOLDER -------------------
  // Example:
  // if (!req.cookies.get("token") && pathname !== "/login") {
  //   const loginUrl = new URL("/login", req.url);
  //   return NextResponse.redirect(loginUrl);
  // }

  return response;
}

// ------------------- CONFIG -------------------
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
