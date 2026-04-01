import { NextResponse, type NextRequest } from "next/server";
import {
  createSupabaseServerClient,
  getBaseDomain,
} from "./app/api/_lib/supabaseClient";
import { corsResponse, getCorsHeaders } from "./lib/cors";
import { handleI18n } from "./middleware/i18n";

const locales = ["en", "fr"];
const defaultLocale = "en";
const protectedRoutes = ["/profile"];
const authRoute = "/auth";

// --- Domain/Host Logic ---

const prodDomainsString = process.env.TRUSTED_PROD_DOMAINS || "";
const devDomainsString = process.env.TRUSTED_DEV_DOMAINS || "";

const trustedDomains = {
  production: prodDomainsString.split(",").map((d) => d.trim()).filter((d) => d.length > 0),
  development: devDomainsString.split(",").map((d) => d.trim()).filter((d) => d.length > 0),
};

function isValidHost(host: string): boolean {
  const hostWithoutPort = host.split(":")[0];
  if (trustedDomains.production.includes(hostWithoutPort)) return true;
  if (trustedDomains.development.includes(host)) return true;
  return false;
}

function getSubdomain(host: string): string {
  const lowerHost = host.toLowerCase();
  const hostWithoutPort = lowerHost.split(":")[0];
  const standardPrefixes = ["www", "m", "mobile"];
  let parts: string[];

  if (hostWithoutPort.endsWith(".localhost")) {
    parts = hostWithoutPort.split(".");
    if (parts.length >= 2 && parts[0] !== "localhost") return parts[0];
    return "main";
  }

  parts = hostWithoutPort.split(".");
  if (parts.length > 2) {
    const firstPart = parts[0];
    if (standardPrefixes.includes(firstPart)) {
      if (parts.length > 3) return parts[1];
      return "main";
    }
    return firstPart;
  }
  return "main";
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  let host = req.headers.get("x-forwarded-host") || req.nextUrl.host;

  // 1. API & CORS Logic
  if (pathname.startsWith("/api")) {
    if (req.method === "OPTIONS") return corsResponse(req);
    const apiRes = NextResponse.next();
    const corsHeaders = getCorsHeaders(req);
    if (corsHeaders) {
      Object.entries(corsHeaders).forEach(([key, value]) => apiRes.headers.set(key, value));
    }
    return apiRes;
  }

  // Skip internal paths
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/wp-admin")
  ) {
    return NextResponse.next();
  }

  // 2. Site Detection
  if (!isValidHost(host)) {
    host = req.nextUrl.host;
  }
  const safeHost = host.split(",")[0].trim();
  const resolvedSite = getSubdomain(safeHost);

  // 3. I18N Logic
  // Check locale early to prevent "language revert" bugs
  const i18nRes = handleI18n(req);
  
  // Determine current locale from path for consistent redirects later
  const currentLocale = locales.find(l => pathname.startsWith(`/${l}/`) || pathname === `/${l}`) || defaultLocale;

  if (i18nRes) {
    // If handleI18n returns a redirect (status 3xx), return it immediately
    // to ensure the browser commits to the new language/cookie.
    if (i18nRes.status >= 300 && i18nRes.status < 400) {
      i18nRes.headers.set("site", resolvedSite);
      i18nRes.cookies.set("site", resolvedSite, { path: "/" });
      return i18nRes;
    }
  }

  // Use i18nRes if it exists (for rewrites), otherwise start a new next() response
  let response = i18nRes || NextResponse.next();
  response.headers.set("site", resolvedSite);
  response.cookies.set("site", resolvedSite, { path: "/" });

  // 4. Auth Check
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, "");
  const isProtected = protectedRoutes.some((route) => pathWithoutLocale.startsWith(route));

  // Redirect to login if protected and no user (preserving current locale)
  if (isProtected && !user) {
    const redirectUrl = new URL(`/${currentLocale}${authRoute}`, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect away from auth page if already logged in (preserving current locale)
  if (user && pathWithoutLocale === authRoute) {
    return NextResponse.redirect(new URL(`/${currentLocale}/profile`, req.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|locales|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)",
  ],
};