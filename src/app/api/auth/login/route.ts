import { NextResponse } from "next/server";
import {
  createSupabaseServer,
  supabaseAnonClient,
  supabaseServerClient,
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
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.log(data.user);

    const res = NextResponse.json({ user: data.user });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
