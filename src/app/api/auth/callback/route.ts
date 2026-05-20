import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/api/_lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as any;

  // Customize the route to redirect the user to after a successful login
  const next = searchParams.get("next") ?? "/profile";

  const supabase = await createSupabaseServerClient();

  // 1. Establish the Session
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Exchange code error:", error.message);
      return NextResponse.redirect(`${origin}/?error=auth-code-error`);
    }
  } else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (error) {
      console.error("OTP verification error:", error.message);
      return NextResponse.redirect(`${origin}/?error=auth-otp-error`);
    }
  }

  // 2. Fetch the newly authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Query the profile row we initialized at signup
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("onboarding_status")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile onboarding status:", error);
      return NextResponse.redirect(new URL("/auth/error", request.url));
    }

    // 3. THE INTERCEPT: Force-route to onboarding if not completed
    if (profile?.onboarding_status !== "completed") {
      return NextResponse.redirect(`${origin}/onboarding`);
    }

    // 4. THE NORMAL FLOW: They are fully onboarded, send them to their destination
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Fallback if no code/hash is present or no user session is found
  return NextResponse.redirect(`${origin}/?error=auth-missing-credentials`);
}