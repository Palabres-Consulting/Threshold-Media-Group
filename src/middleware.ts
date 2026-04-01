import { NextResponse, type NextRequest } from "next/server";
import {
  createSupabaseServerClient,
  getBaseDomain,
} from "./app/api/_lib/supabaseClient";
import { corsResponse, getCorsHeaders } from "./lib/cors";
import { handleI18n } from "./middleware/i18n"; // Assuming this is where it lives

const locales = ["en", "fr"];
const defaultLocale = "en";
const protectedRoutes = ["/profile"];
const authRoute = "/auth";

// --- Domain/Host Logic (Keeping your original logic) ---

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

  // Initialize base response
  let response = NextResponse.next();
  response.headers.set("site", resolvedSite);
  response.cookies.set("site", resolvedSite, { path: "/" });

  // 3. I18N Logic (Replacing the old getLocale/pathnameHasLocale block)
  const i18nRes = handleI18n(req);

  if (i18nRes) {
    // Merge the 'site' headers and cookies into the i18n response
    i18nRes.headers.set("site", resolvedSite);
    i18nRes.cookies.set("site", resolvedSite, { path: "/" });
    
    // If handleI18n returns a redirect/rewrite, use it as our active response
    response = i18nRes;
    
    // If it's a hard redirect, return immediately to prevent unnecessary Supabase calls
    if (response.status >= 300 && response.status < 400) return response;
  }

  // 4. Auth Check
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Strip locale prefix for route matching (Matches en or fr)
  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, "");
  const isProtected = protectedRoutes.some((route) => pathWithoutLocale.startsWith(route));

  // Redirect to login if protected and no user
  if (isProtected && !user) {
    const redirectUrl = new URL(`/${defaultLocale}${authRoute}`, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect away from auth page if already logged in
  if (user && pathWithoutLocale === authRoute) {
    return NextResponse.redirect(new URL(`/${defaultLocale}/profile`, req.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|locales|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)",
  ],
};