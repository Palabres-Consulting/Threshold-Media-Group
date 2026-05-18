import { NextResponse } from "next/server";
import { createSupabaseServer } from "../../_lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { email, password, title } = await req.json();
    const supabase = await createSupabaseServer();

    // 1. Create user with supabase auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { message: error?.message ?? "Failed to create user" }, // Changed to 'message' to match your toast logic
        { status: 400 }
      );
    }

    const user = data.user;

    // 2. Insert profile row
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      title,
      avatar_url: null,
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // We log the error, but we don't stop the flow. The user is already created in Auth!
    }

    // 3. THE FIX: We stop here! 
    // We do NOT try to log them in because their email isn't verified yet.
    // We return a 200 status so Axios knows it was successful, 
    // the toast turns green, and Next.js redirects to the holding room!
    return NextResponse.json(
      { message: "Account created! Please check your email." },
      { status: 200 }
    );

  } catch (err: any) {
    return NextResponse.json(
      { message: err.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}