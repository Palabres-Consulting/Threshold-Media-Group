import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../_lib/supabaseClient";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ savedUrls: [] }, { status: 401 });
  }

  // Fetch ONLY the wp_url column for speed
  const { data, error } = await supabase
    .from("saved_articles")
    .select("wp_url")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Flatten the array of objects into a simple array of strings
  const savedUrls = data.map((row) => row.wp_url);
  
  return NextResponse.json({ savedUrls });
}