import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/api/_lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  
  // Customize the route to redirect the user to after a successful login
  const next = searchParams.get("next") ?? "/profile";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("Exchange code error:", error.message);
    }
  }

  // Fallback if no code is present or if an error occurred during exchange
  return NextResponse.redirect(`${origin}/?error=auth-code-error`);
}