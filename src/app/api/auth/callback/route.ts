import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/api/_lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  

const token_hash = searchParams.get('token_hash')
const type = searchParams.get('type') as any

// Customize the route to redirect the user to after a successful login
const next = searchParams.get("next") ?? "/profile";

  const supabase = await createSupabaseServerClient();





  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("Exchange code error:", error.message);
    }
  }


  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }




  // Fallback if no code is present or if an error occurred during exchange
  return NextResponse.redirect(`${origin}/?error=auth-code-error`);
}