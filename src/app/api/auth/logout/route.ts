// app/api/auth/logout/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { cookies } from "next/headers";
import { createSupabaseServer } from "../../_lib/supabaseClient";

export async function POST(req: Request) {
  const cookieStore = await cookies();

  // 1. Tell Supabase server to formally invalidate the session token on its end
  try {
    const supabase = await createSupabaseServer();
    await supabase.auth.signOut();
  } catch (e) {
    // Fail silently if session was already expired
  }

  const response = NextResponse.json({ success: true });
  const host = req.headers.get("host") || "";

  // Normalize base domain name string (handle localhost vs production)
  let baseDomain: string | undefined = undefined;
  if (host.includes("thresholdmediagroup.com")) {
    baseDomain = ".thresholdmediagroup.com"; // Notice the leading dot: targets all subdomains
  }

  // The comprehensive list of standard auth keys Supabase and NextJS use
  const targetKeys = [
    "sb-access-token",
    "sb-refresh-token",
    "supabase-auth-token",
    "sb-provider-token",
  ];

  // Fallback scan: grab any custom cookies containing "auth" or "token"
  const allCookies = cookieStore.getAll();
  allCookies.forEach((c) => {
    const lowerName = c.name.toLowerCase();
    if (
      (lowerName.includes("auth") || lowerName.includes("token")) &&
      !targetKeys.includes(c.name)
    ) {
      targetKeys.push(c.name);
    }
  });

  // 2. Clear out everything looping through multiple domain strategies
  targetKeys.forEach((keyName) => {
    // Strategy A: Clear with standard wildcard domain (wipes cross-subdomain sessions)
    if (baseDomain) {
      response.cookies.set(keyName, "", {
        path: "/",
        maxAge: 0,
        expires: new Date(0), // Deep Safari compatibility fix
        domain: baseDomain,
        secure: true,
        sameSite: "lax",
        httpOnly: true,
      });
    }

    // Strategy B: Clear explicitly on current exact host domain (wipes direct host overrides)
    response.cookies.set(keyName, "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0), // Deep Safari compatibility fix
      secure: true,
      sameSite: "lax",
      httpOnly: true,
    });
  });

  return response;
}
