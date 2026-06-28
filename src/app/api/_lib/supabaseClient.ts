import { getBaseDomain } from "@/lib/utils";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";

export const supabaseServerClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!, // server-side
  );

export const supabaseAnonClient = () =>
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!, // general use
  );

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
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                domain: cookieDomain === "localhost" ? "" : cookieDomain,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
              });
            });
          } catch {
            // If this runs in a Server Component, `setAll` will throw.
            // That’s okay — Supabase middleware/session refresh will handle it.
          }
        },
      },
    },
  );
}

export async function createSupabaseServer() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const host = headersList.get("host") || "localhost";
  const cookieDomain = getBaseDomain(host);
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // server-side
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
                domain: cookieDomain === "localhost" ? "" : cookieDomain,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
              });
            });
          } catch {
            // If this runs in a Server Component, `setAll` will throw.
            // That’s okay — Supabase middleware/session refresh will handle it.
          }
        },
      },
    },
  );
}

export async function createServerSupabaseClient() {
  console.log("Is Key Defined?", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  const cookieStore = await cookies();
  const headersList = await headers();
  const host = headersList.get("host") || "localhost";
  const cookieDomain = getBaseDomain(host);

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
                domain: cookieDomain === "localhost" ? "" : cookieDomain,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
              });
            });
          } catch {
            // If this runs in a Server Component, `setAll` will throw.
            // That’s okay — Supabase middleware/session refresh will handle it.
          }
        },
      },
    },
  );
}



export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}