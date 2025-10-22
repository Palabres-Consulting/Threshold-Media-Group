// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "../../_lib/supabaseClient";

export async function POST(req: Request) {
  const { email, password, title } = await req.json();
  const supabase = await createSupabaseServer();

  // creating user with supabase auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to create user" },
      { status: 400 }
    );
  }

  const user = data.user;

  // inserting profile row
  const insertProfileResponse = await supabase.from("profiles").insert({
    id: user.id,
    title,
    avatar_url: null, 
  });

  console.log(insertProfileResponse);

  // logging them in immediately (so they get session cookie)
  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (loginError || !loginData.session) {
    return NextResponse.json(
      { error: "User created but login failed" },
      { status: 400 }
    );
  }

  // Set session cookie
  const res = NextResponse.json({ user: loginData.user });

  return res;
}
