// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import {
  createSupabaseServerClient,
  getBaseDomain,
} from "./app/api/_lib/supabaseClient";
import { corsResponse, getCorsHeaders } from "./lib/cors";

const locales = ["en", "fr"];
const defaultLocale = "en";

// Routes requiring authentication
const protectedRoutes = ["/profile"];

// Routes for authentication (login/signup)
const authRoute = "/auth";

function getLocale(req: NextRequest): string {
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  const acceptLang = req.headers.get("accept-language") || "";
  const languages = acceptLang.split(",").map((l) => l.split(";")[0]);
  const matched = languages
    .map((lang) => lang.split("-")[0])
    .find((lang) => locales.includes(lang));
  return matched || defaultLocale;
}

// Read from environment variables
const prodDomainsString = process.env.TRUSTED_PROD_DOMAINS || "";
const devDomainsString = process.env.TRUSTED_DEV_DOMAINS || "";

const trustedDomains = {
  production: prodDomainsString
    .split(",")
    .map((d) => d.trim())
    .filter((d) => d.length > 0),
  development: devDomainsString
    .split(",")
    .map((d) => d.trim())
    .filter((d) => d.length > 0),
};

function isValidHost(host: string): boolean {
  const hostWithoutPort = host.split(":")[0];

  // Check production domains (host only)
  if (trustedDomains.production.includes(hostWithoutPort)) {
    return true;
  }

  // Check development domains (host:port must match exactly)
  if (trustedDomains.development.includes(host)) {
    return true;
  }

  return false;
}
function getSubdomain(host: string): string {
  // 1. Convert to lowercase for consistent comparison
  const lowerHost = host.toLowerCase();

  // 2. Remove port number if present (common in localhost:3000)
  const hostWithoutPort = lowerHost.split(":")[0];

  // 3. Define standard prefixes to ignore
  const standardPrefixes = ["www", "m", "mobile"];

  let parts: string[];

  // --- Development Check: Handling *.localhost ---
  if (hostWithoutPort.endsWith(".localhost")) {
    // Example: "extraction.localhost" -> ["extraction", "localhost"]
    // Example: "app.extraction.localhost" -> ["app", "extraction", "localhost"]

    parts = hostWithoutPort.split(".");

    console.log(parts);
    console.log(parts.length);
    // If there are more than 2 parts (e.g., "extraction.localhost"), the first part is the subdomain.
    if (parts.length >= 2 && parts[0] !== "localhost") {
      return parts[0];
    }
    // Otherwise (e.g., "localhost"), return "main".
    return "main";
  }

  // --- Production Check: Handling Standard TLDs (e.g., .com, .net) ---
  parts = hostWithoutPort.split(".");

  if (parts.length > 2) {
    const firstPart = parts[0];

    // Check if the first part is a standard prefix (e.g., www.example.com)
    if (standardPrefixes.includes(firstPart)) {
      // Check for nested subdomains (e.g., sub.www.example.com)
      if (parts.length > 3) {
        return parts[1];
      }
      // If only 'www', 'm', etc., return "main".
      return "main";
    }

    // If the first part is NOT a standard prefix (e.g., app.example.com),
    // it is the subdomain.
    return firstPart;
  }

  // 4. Fallback for simple domains (example.com) or naked localhost
  return "main";
}
export async function middleware(req: NextRequest) {
  console.log("middleware running");

  const startTime = Date.now();

  // ... your code ...

  const supabaseCookies = req.cookies
    .getAll()
    .filter((c) => c.name.includes("supabase"));

  console.log("Supabase cookies at middleware start:", supabaseCookies.length);
  console.log("Middleware execution time:", Date.now() - startTime, "ms");

  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // console.log(req);

  const hostname = url.hostname;
  let host = req.headers.get("x-forwarded-host") || req.nextUrl.host;
  const path = url.pathname;
  const response = NextResponse.next();

  if (pathname.startsWith("/api")) {
    if (req.method === "OPTIONS") {
      return corsResponse(req);
    }
    const response = NextResponse.next();
    const corsHeaders = getCorsHeaders(req);
    if (corsHeaders) {
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }
    return response;
  }

  // Skip internal paths
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/wp-admin")
  ) {
    return NextResponse.next();
  }

  // Site detection
  console.log(host);

  if (!isValidHost(host)) {
    console.error(
      `SECURITY ALERT: Untrusted host detected: ${host}. Falling back to safe default.`
    );

    // 2. Overwrite 'host' with a known safe value
    host = req.nextUrl.host;
  }

  const safeHost = host.split(",")[0].trim();
  // if (process.env.NODE_ENV === "development" && siteParam) {
  //   host = `${siteParam}.localhost:3000`;
  // }
  const cookieSite = req.cookies.get("site")?.value;
  const resolvedSite = getSubdomain(safeHost);

  console.log(resolvedSite);

  response.headers.set("site", resolvedSite);
  response.cookies.set("site", resolvedSite, { path: "/" });

  // Locale detection
  const pathnameHasLocale = locales.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );
  if (!pathnameHasLocale) {
    const locale = getLocale(req);
    url.pathname = `/${locale}${pathname}`;
    response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
    return NextResponse.redirect(url);
  }

  // ------------------- AUTH CHECK -------------------
  // const supabase = await createSupabaseServerClient();

  const cookieDomain = getBaseDomain(safeHost);

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("middelware", user);

  // Strip locale prefix for easier route matching
  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, "");

  // 1. Protected route check
  const isProtected = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  if (isProtected && !user) {
    console.log("Redirecting to auth route, user not logged in");

    return NextResponse.redirect(
      new URL(`/${defaultLocale}${authRoute}`, req.url)
    );
  }

  // 2. Auth route check

  const isLoggedIn = user !== null;

  if (user) {
    console.log(`user: ${user.email}`);
  }

  if (user && pathWithoutLocale === authRoute) {
    // Redirect logged-in users away from login/signup

    console.log("Redirecting logged-in user away from auth route");
    return NextResponse.redirect(new URL(`/${defaultLocale}/profile`, req.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|locales|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)",
  ],
};
