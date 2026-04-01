export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const response = NextResponse.json({ success: true });
  
  // Get the current domain (e.g., tresholdmediagroup.com)
  const host = req.headers.get("host") || "";
  const domain = host.includes("tresholdmediagroup.com") 
    ? ".tresholdmediagroup.com" 
    : undefined;

  const allCookies = cookieStore.getAll();

  allCookies.forEach((cookie) => {
    if (cookie.name.includes("auth-token")) {
      // 1. Delete from current store
      cookieStore.set(cookie.name, "", { 
        path: "/", 
        maxAge: 0, 
        domain: domain // THIS IS THE KEY FOR PRODUCTION
      });
      
      // 2. Send deletion header in response
      response.cookies.set(cookie.name, "", {
        path: "/",
        maxAge: 0,
        domain: domain,
        secure: true, // Must be true in production
        sameSite: "lax",
      });
    }
  });

  return response;
}
