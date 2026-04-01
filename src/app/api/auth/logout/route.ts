import { NextResponse } from "next/server";
import { supabaseAnonClient, supabaseServerClient } from "../../_lib/supabaseClient";

export async function POST() {
  try {
    const supabase = supabaseServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create the response
    const res = NextResponse.json({ success: true });

    // Clear the access token
    res.cookies.set("sb-access-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
      sameSite: "strict",
    });

    // Recommended: Clear the refresh token as well if you use one
    res.cookies.set("sb-refresh-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
      sameSite: "strict",
    });

    // IMPORTANT: You must return the response object!
    return res; 

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}