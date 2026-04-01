export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "../../_lib/supabaseClient";
import { withCors } from "../../_lib/apiHandler";

async function handler(req: NextRequest) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // Try to fetch profile
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("title, avatar_url")
    .eq("id", user.id)
    .maybeSingle(); // safer than .single()

  // Build fallback profile
  const fallbackProfile = {
    title: user.user_metadata.full_name ?? "New User",
    avatar_url: user.user_metadata.avatar_url ?? null,
  };

  const userProfile = {
    title: profile?.title ?? fallbackProfile.title,
    avatar_url: profile?.avatar_url ?? fallbackProfile.avatar_url,
    email: user.email,
    password:
      user.app_metadata.provider === "google"
        ? `oauth:${user.app_metadata.provider}`
        : "********",
  };

  console.log(userProfile);

  return NextResponse.json(userProfile, { status: 200 });
}

export const GET = withCors(handler);
