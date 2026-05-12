// src/lib/supabase/supabaseBroswerCLient.ts
import { createBrowserClient } from "@supabase/ssr";
import { getBaseDomain } from "@/lib/utils";



export function createClient() {
  const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
  const cookieDomain = getBaseDomain(host);

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: cookieDomain === "localhost" ? "" : cookieDomain,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
      auth: {
        flowType: "pkce",
      },
    }
  );
}