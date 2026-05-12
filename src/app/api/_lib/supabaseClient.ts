import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";

export function getBaseDomain(host: string): string {
  const hostWithoutPort = host.split(":")[0];

  // Development: localhost
  if (hostWithoutPort === "localhost") {
    return ""; // Empty string allows the browser to default to current host
  }

  // Production: extract base domain
  const parts = hostWithoutPort.split(".");
  if (parts.length >= 2) {
    // threshold.group -> .threshold.group
    // asint.threshold.group -> .threshold.group
    return `.${parts.slice(-2).join(".")}`;
  }

  return hostWithoutPort;
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const host = headersList.get("host") || "localhost";
  const cookieDomain = getBaseDomain(host);

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                // Only apply domain if we actually have one (ignores localhost)
                ...(cookieDomain && { domain: cookieDomain }),
                sameSite: "lax", // Better for subdomain sharing
                secure: process.env.NODE_ENV === 'production',
                path: "/",
              });
            });
          } catch (error) {
            // Server Component ignore
          }
        },
      },
    }
  );
}
export async function createSupabaseServer() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const host = headersList.get("host") || "localhost";
  const cookieDomain = getBaseDomain(host);
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!, // server-side
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                domain: cookieDomain, // 👈 This is the key!
                sameSite: "none", // Important for subdomain sharing
                secure: true,
              });
            });
          } catch {
            // If this runs in a Server Component, `setAll` will throw.
            // That’s okay — Supabase middleware/session refresh will handle it.
          }
        },
      },
    }
  );
}



