// middleware.ts
"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";

  let subdomain = "main";
  if (host.startsWith("extraction.")) subdomain = "extraction";
  if (host.startsWith("asint.")) subdomain = "asint";

  // Add as query param
  url.searchParams.set("subdomain", subdomain);

  return NextResponse.rewrite(url);
}
