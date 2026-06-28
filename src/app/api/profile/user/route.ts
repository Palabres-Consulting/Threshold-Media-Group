import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "../../_lib/supabaseClient";
import { withCors } from "../../_lib/apiHandler";

async function handler(req: NextRequest) {
  const supabase = await createSupabaseServer();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Fetch updated properties explicitly
  const { data: profile } = await supabase
    .from("profiles")
    .select(`
    *,
    subscriptions (*) 
  `)
    .eq("id", user.id)
    .maybeSingle();

  const fallbackProfile = {
    title: user.user_metadata.full_name ?? "New User",
    avatar_url: user.user_metadata.avatar_url ?? null,
  };

  const userProfile = {
    title: profile?.title ?? fallbackProfile.title,
    avatar_url: profile?.avatar_url ?? fallbackProfile.avatar_url,
    email: user.email,
    password: user.app_metadata.provider === "google"
      ? `oauth:${user.app_metadata.provider}`
      : "********",
    interests: profile?.interests ?? [],
    avatar_type: profile?.avatar_type ?? null,
    persona: profile?.persona ?? null, // Exposing clean raw state to UI client context
    subscriptions: profile?.subscriptions ?? [],
  };

  return NextResponse.json(userProfile, { status: 200 });
}

export const GET = withCors(handler);
