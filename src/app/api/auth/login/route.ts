import { NextResponse } from "next/server";
import {
  createSupabaseServer,
} from "../../_lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const supabase = await createSupabaseServer();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        return NextResponse.json(
          { message: "Please verify your email before logging in." },
          { status: 401 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.log(data.user);

    const res = NextResponse.json({ user: data.user });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
