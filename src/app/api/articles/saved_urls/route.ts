import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../_lib/supabaseClient";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ savedUrls: [] }, { status: 401 });
  }

  // Fetch ONLY the wp_url column for speed

  const { data, error } = await supabase
    .from("saved_articles")
    .select("post_id")
    .eq("user_id", user.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Return an array of IDs
  const savedIds = data.map((row) => row.post_id);
  return NextResponse.json({ savedIds });
}
