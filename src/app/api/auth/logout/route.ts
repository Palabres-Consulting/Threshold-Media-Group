import { NextResponse } from "next/server";
import { supabaseAnonClient } from "../../_lib/supabaseClient";

export async function POST() {
  try {
    const supabase = supabaseAnonClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const res = NextResponse.json({ success: true });
    res.cookies.set("sb-access-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0, // delete immediately
      sameSite: "strict",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
