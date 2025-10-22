import { NextResponse } from "next/server";
import {
  createSupabaseServer,
  createSupabaseServerClient,
} from "../../_lib/supabaseClient";

export async function GET() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("title, avatar_url")
    .eq("id", user.id)
    .single();


    
  const userProfile = {
    ...profile,
    email: user.email,
    password: user.app_metadata.provider === "google" ? `oauth:${user.app_metadata.provider}` : "********",
  };

  return NextResponse.json(userProfile ?? {}, { status: 200 });
}
