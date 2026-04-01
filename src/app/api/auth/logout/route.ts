import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const response = NextResponse.json({ success: true });

  // 1. Identify all cookies that look like Supabase auth chunks
  // These usually start with 'sb-' and contain 'auth-token'
  const supabaseCookies = allCookies.filter(cookie => 
    cookie.name.includes("auth-token") && cookie.name.startsWith("sb-")
  );

  // 2. Nuke each one found
  supabaseCookies.forEach((cookie) => {
    // Kill it in the store
    cookieStore.set(cookie.name, "", { path: "/", maxAge: 0 });
    
    // Kill it in the response header
    response.cookies.set(cookie.name, "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
  });

  return response;
}