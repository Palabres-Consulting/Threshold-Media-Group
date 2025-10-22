// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  createSupabaseServer,
  createSupabaseServerClient,
} from "./app/api/_lib/supabaseClient";

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

function getSubdomain(host: string): string {
  const parts = host.split(".");
  if (parts.length > 2) return parts[0];
  return "main";
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

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
  const siteParam = url.searchParams.get("site");
  let host = url.host;
  if (process.env.NODE_ENV === "development" && siteParam) {
    host = `${siteParam}.localhost:3000`;
  }
  const cookieSite = req.cookies.get("site")?.value;
  const resolvedSite = siteParam || cookieSite || getSubdomain(host);

  const response = NextResponse.next();
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
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|locales|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)"],
};
